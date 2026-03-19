//Centraliza toda a inteligênica do app. Caso eu queira mudar a url da API ou alterar a regra de como o saldo é calculado, isso acontece aqui. O app só precisa saber do resultado pronto.

import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle, IconTrash } from '@tabler/icons-react';

//Back
const API_URL = 'http://localhost:3000';
//__________________________________________________________________________________
export function useTransacoes(token, idUsuarioLogado) {
    // Estados migrados.
    const [transacoes, setTransacoes] = useState([]);

    const [mesFiltro, setMesFiltro] = useState(() => {
        const salvo = sessionStorage.getItem('filtroMes');
        return salvo || String(new Date().getMonth() + 1);
    });

    const [anoFiltro, setAnoFiltro] = useState(() => {
        const salvo = sessionStorage.getItem('filtroAno');
        return salvo || String(new Date().getFullYear());
    });

    const [categoriasFiltro, setCategoriasFiltro] = useState(() => {
        const salvo = sessionStorage.getItem('filtroCategorias');
        if (!salvo) return [];
        try {
            const parsed = JSON.parse(salvo);
            return Array.isArray(parsed) ? parsed : [];
        } catch { return []; }
    });
    //_____________________________________________________________________
    //Persistência dos filtros (useEffect (App.jsx))
    useEffect(() => {
        if (mesFiltro) sessionStorage.setItem('filtroMes', mesFiltro);
        if (anoFiltro) sessionStorage.setItem('filtroAno', anoFiltro);
        sessionStorage.setItem('filtroCategorias', JSON.stringify(categoriasFiltro));
    }, [mesFiltro, anoFiltro, categoriasFiltro]);
    //_____________________________________________________________________
    // Funções de API
    const carregarDados = async (id = idUsuarioLogado, tokenAtual = token) => {
        if (!id || id === 'undefined') return;
        try {
            const resp = await fetch(`${API_URL}/transacoes/usuario/${id}`, { //rota
                headers: { 'Authorization': `Bearer ${tokenAtual}` }
            });
            if (resp.ok) {
                const dados = await resp.json();
                setTransacoes(Array.isArray(dados) ? dados : []);
            } else {
                setTransacoes([]);
            }
        } catch (erro) {
            console.error("Erro na busca de dados:", erro);
            setTransacoes([]);
        }
    };

    const salvarTransacaoApi = async (body, idEditando) => {
        const method = idEditando ? 'PUT' : 'POST';
        const url = idEditando 
            ? `${API_URL}/transacoes/${idEditando}` //Rota
            : `${API_URL}/transacoes/usuario/${idUsuarioLogado}`;//Rota

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const erroBackend = await response.text();
                notifications.show({ title: 'Erro', message: erroBackend, color: 'red', icon: <IconX size={18} /> });
                return false;
            }

            notifications.show({
                title: 'Sucesso',
                message: idEditando ? 'Transação atualizada.' : 'Transação salva.',
                color: 'green',
                icon: <IconCheck size={18} />
            });

            await carregarDados();
            return true;
        } catch (erro) {
            notifications.show({ title: 'Erro de conexão', message: 'Verifique o servidor.', color: 'red', icon: <IconX size={18} /> });
            return false;
        }
    };

    const excluirTransacaoApi = async (idExcluir) => {
        try {
            await fetch(`${API_URL}/transacoes/${idExcluir}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await carregarDados();
            notifications.show({ title: 'Excluído', message: 'Removida com sucesso.', color: 'orange', icon: <IconTrash size={18} /> });
            return true;
        } catch (erro) {
            notifications.show({ title: 'Erro', message: 'Falha ao excluir.', color: 'red', icon: <IconX size={18} /> });
            return false;
        }
    };
    //_________________________________________________________________________________________________________________________________
    //Lógica de filtros e cálculos
    const listaSegura = Array.isArray(transacoes) ? transacoes : [];

    const transacoesFiltradas = (!mesFiltro || !anoFiltro) ? [] : listaSegura.filter((t) => {
        if (!t.data) return false;
        const [ano, mes] = t.data.split('-');
        const matchMes = parseInt(mes) === parseInt(mesFiltro);
        const matchAno = parseInt(ano) === parseInt(anoFiltro);
        const matchCategoria = categoriasFiltro.length === 0 || 
                               categoriasFiltro.includes('Todas as categorias') || 
                               categoriasFiltro.includes(t.categoria);
        return matchMes && matchAno && matchCategoria;
    });

    const totalReceitas = transacoesFiltradas.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
    const totalDespesas = transacoesFiltradas.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
    const saldo = totalReceitas - totalDespesas;

    return {
        transacoesFiltradas,
        totalReceitas,
        totalDespesas,
        saldo,
        mesFiltro, setMesFiltro,
        anoFiltro, setAnoFiltro,
        categoriasFiltro, setCategoriasFiltro,
        carregarDados,
        salvarTransacaoApi,
        excluirTransacaoApi
    };
}