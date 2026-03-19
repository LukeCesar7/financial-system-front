//Lógica de geração de PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatarBRL, formatarDataCurta } from './formatadores';

export const gerarRelatorioPDF = (transacoes, usuario, periodo) => {
    const doc = new jsPDF();

    // Cabeçalho - Refinar
    doc.setFontSize(20);
    doc.text("Relatório Financeiro", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Usuário: ${usuario}`, 14, 30);
    doc.text(`Período: ${periodo}`, 14, 36);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 42);

    // Cálculos rápidos para o resumo no PDF
    const totalReceitas = transacoes.filter(t => t.tipo === 'RECEITA').reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);
    const totalDespesas = transacoes.filter(t => t.tipo === 'DESPESA').reduce((acc, t) => acc + parseFloat(t.valor || 0), 0);

    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Receitas: ${formatarBRL(totalReceitas)}`, 14, 55);
    doc.text(`Despesas: ${formatarBRL(totalDespesas)}`, 14, 62);
    doc.text(`Saldo: ${formatarBRL(totalReceitas - totalDespesas)}`, 14, 69);

    // Tabela
    const colunas = [["Data", "Descrição", "Categoria", "Tipo", "Valor"]];
    const linhas = transacoes.map((t) => [
        formatarDataCurta(t.data),// Data
        t.descricao,
        t.categoria,
        t.tipo === 'RECEITA' ? 'Receita (+)' : 'Despesa (-)',
        formatarBRL(t.valor)// $ BR
    ]);

    autoTable(doc, {
        startY: 78,
        head: colunas,
        body: linhas,
        headStyles: { fillColor: [76, 110, 245] },
    });

    doc.save(`Relatorio_${periodo.replace(/ /g, '_')}.pdf`);
};