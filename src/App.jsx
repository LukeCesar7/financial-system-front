import { useEffect, useState } from 'react';

// utils e constants
import { formatarBRL, formatarDataLonga } from './utils/formatadores';
import { listaCategorias, listaMeses, listaAnos, corBadgeCategoria, iconePorCategoria } from './constants/opcoes';
import { gerarRelatorioPDF } from './utils/relatorio';

// componentes
import GraficoPizza from './components/GraficoPizza';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import ResumoCards from './components/ResumoCards';
import FormularioTransacao from './components/FormularioTransacao';
import TabelaTransacoes from './components/TabelaTransacoes';

// hooks
import { useTransacoes } from './hooks/useTransacoes';

// ui
import {
    Container, Grid, Card, Text, Group, Button, Select,
    MultiSelect, Title, ActionIcon, Box, Stack, ThemeIcon, Tooltip, Modal
} from '@mantine/core';
import {
    IconFilter, IconDots, IconLogout, IconFilterOff, IconFileDownload, IconAlertCircle
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function App() {
    // estados de autenticação
    const [isAutenticado, setIsAutenticado] = useState(() => localStorage.getItem('isAutenticado') === 'true');
    const [usuarioLogado, setUsuarioLogado] = useState(() => localStorage.getItem('usuarioLogado') || '');
    const [idUsuarioLogado, setIdUsuarioLogado] = useState(() => localStorage.getItem('idUsuarioLogado') || null);
    const [token, setToken] = useState(() => localStorage.getItem('tokenJWT') || '');

    //const [isAutenticado, setIsAutenticado] = useState(true); // Força como true
    //const [usuarioLogado, setUsuarioLogado] = useState('Luquian'); // Seu nome
    //const [idUsuarioLogado, setIdUsuarioLogado] = useState('1'); // Um ID qualquer
    //const [token, setToken] = useState('debug-token'); // Um token qualquer

    // estados de formulário (O que o usuário está digitando)
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState(null);
    const [categoria, setCategoria] = useState(null);
    const [data, setData] = useState('');
    const [idEditando, setIdEditando] = useState(null);
    const [chaveReset, setChaveReset] = useState(0);

    // Estados de UI
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
    const [idExcluir, setIdExcluir] = useState(null);

    // chamada do custom hooks (Toda a lógica de transações está aqui)
    const {
        transacoesFiltradas, totalReceitas, totalDespesas, saldo,
        mesFiltro, setMesFiltro, anoFiltro, setAnoFiltro,
        categoriasFiltro, setCategoriasFiltro,
        carregarDados, salvarTransacaoApi, excluirTransacaoApi
    } = useTransacoes(token, idUsuarioLogado);

    // Carregar dados iniciais
    useEffect(() => {
        if (idUsuarioLogado && token) carregarDados();
    }, [idUsuarioLogado, token, carregarDados]);

    // FUNÇÕES DE AÇÃO
    const salvarTransacao = async () => {
        const desc = descricao?.trim();
        const val = valor?.trim();

        if (!desc || !val || !data || !categoria || !tipo) {
            return notifications.show({
                title: 'Campos obrigatórios',
                message: 'Por favor, preencha todos os campos.',
                color: 'yellow',
                icon: <IconAlertCircle size={18} />
            });
        }

        const valorFormatado = parseFloat(val.replace(/\./g, '').replace(',', '.'));
        const body = { descricao: desc, valor: valorFormatado, tipo, categoria, data };

        const sucesso = await salvarTransacaoApi(body, idEditando);
        if (sucesso) {
            limparFormulario();
            const [, mesAdd] = data.split('-');
            setMesFiltro(parseInt(mesAdd).toString());
            setAnoFiltro(data.split('-')[0]);
        }
    };

    const confirmarExclusao = async () => {
        if (!idExcluir) return;
        const sucesso = await excluirTransacaoApi(idExcluir);
        if (sucesso) {
            setModalExcluirAberto(false);
            setIdExcluir(null);
        }
    };
    
    //Máquina do tempo
    const editarTransacao = (t) => {
        setDescricao(t.descricao);
        setValor(t.valor.toString().replace('.', ','));
        setTipo(t.tipo);
        setCategoria(t.categoria);
        setData(t.data);
        setIdEditando(t.id);
    };

    const limparFormulario = () => {
        setDescricao(''); setValor(''); setCategoria(null); setData(''); setTipo(null); setIdEditando(null);
        setChaveReset(v => v + 1);
    };

    const limparFiltros = () => {
        setMesFiltro(null); setAnoFiltro(null); setCategoriasFiltro([]);
    };

    const handleLogout = () => {
        setIsAutenticado(false);
        localStorage.clear();
        handleLogoutRedirection(); // Reset de filtros internos se necessário
    };

    // Renderização de Categoria (Selects)
    const renderizarOpcaoCategoria = ({ option }) => {
        const Icone = iconePorCategoria[option.value] || IconDots;
        return (
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color={corBadgeCategoria[option.value] || 'gray'} variant="filled" radius="xl" size="sm">
                    <Icone size={14} />
                </ThemeIcon>
                <Text size="sm">{option.label}</Text>
            </Group>
        );
    };

    if (!isAutenticado) {
        return <Login onLogin={(nome, id, tk) => {
            setIsAutenticado(true); setUsuarioLogado(nome); setIdUsuarioLogado(id); setToken(tk);
            localStorage.setItem('isAutenticado', 'true');
            localStorage.setItem('usuarioLogado', nome);
            localStorage.setItem('idUsuarioLogado', id);
            localStorage.setItem('tokenJWT', tk);
        }} />;
    }

    return (
        <>
            <Modal opened={modalExcluirAberto} onClose={() => setModalExcluirAberto(false)} title="Confirmar exclusão" centered>
                <Text mb="md">Tem certeza de que deseja excluir esta transação?</Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setModalExcluirAberto(false)}>Cancelar</Button>
                    <Button color="red" onClick={confirmarExclusao}>Excluir</Button>
                </Group>
            </Modal>

            <Container fluid px="xl" pt="xl"> {/*Cabeçalho de boas vindas */}
                <Group justify="space-between" mb="md" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                        <Box w={5} h={45} bg="indigo" style={{ borderRadius: '8px' }} />
                        <Stack gap={0}>
                            <Title order={2} size="h3">Olá, {usuarioLogado}</Title>
                            <Text size="sm" c="dimmed" tt="capitalize" mt={-4}>{formatarDataLonga(new Date())}</Text>
                        </Stack>
                    </Group>
                    <Group gap="sm">
                        <ThemeToggle />
                        <Button variant="subtle" color="red" onClick={handleLogout} leftSection={<IconLogout size={18} />}>Sair</Button>
                    </Group>
                </Group>
            </Container>

            <Container size="xl" pb="xl">
                <Group justify="flex-end" mb="xl" gap="sm">
                    <Select placeholder="Mês" data={listaMeses} value={mesFiltro} onChange={setMesFiltro} w={170} clearable />
                    <Select placeholder="Ano" data={listaAnos} value={anoFiltro} onChange={setAnoFiltro} w={110} clearable />
                    <MultiSelect
                        leftSection={<IconFilter size={16} />}
                        placeholder="Categorias"
                        data={listaCategorias}
                        value={categoriasFiltro}
                        onChange={setCategoriasFiltro}
                        w={250}
                        renderOption={renderizarOpcaoCategoria}
                        clearable
                    />
                    <Tooltip label="Limpar Filtros"><ActionIcon variant="light" color="red" size="lg" onClick={limparFiltros}><IconFilterOff size={20} /></ActionIcon></Tooltip>
                    <Button color="teal" variant="light" leftSection={<IconFileDownload size={18} />} onClick={() => gerarRelatorioPDF(transacoesFiltradas, usuarioLogado, `${mesFiltro}/${anoFiltro}`)} disabled={!mesFiltro || !anoFiltro}>Gerar PDF</Button>
                </Group>

                <ResumoCards saldo={saldo} totalReceitas={totalReceitas} totalDespesas={totalDespesas} formatarBRL={formatarBRL} />
                {/* O coração - Formunário e tabela*/}
                <Grid mb="xl">
                    <Grid.Col span={{ base: 12, md: 5 }}>
                        <Card padding="lg" radius="md" shadow="sm" withBorder h="100%"><GraficoPizza labels={Object.keys(transacoesFiltradas.reduce((acc, t) => { if (t.tipo === 'DESPESA') acc[t.categoria] = (acc[t.categoria] || 0) + t.valor; return acc; }, {}))} valores={Object.values(transacoesFiltradas.reduce((acc, t) => { if (t.tipo === 'DESPESA') acc[t.categoria] = (acc[t.categoria] || 0) + t.valor; return acc; }, {}))} /></Card>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 7 }}>
                        <FormularioTransacao {...{ descricao, setDescricao, tipo, setTipo, valor, setValor, data, setData, categoria, setCategoria, idEditando, chaveReset, listaCategorias, renderizarOpcaoCategoria, salvarTransacao, limparFormulario }} />
                    </Grid.Col>
                </Grid>

                <TabelaTransacoes transacoesFiltradas={transacoesFiltradas} mesFiltro={mesFiltro} anoFiltro={anoFiltro} iconePorCategoria={iconePorCategoria} corBadgeCategoria={corBadgeCategoria} formatarBRL={formatarBRL} editarTransacao={editarTransacao} removerTransacao={(id) => { setIdExcluir(id); setModalExcluirAberto(true); }} />
            </Container>
        </>
    );
}

export default App;