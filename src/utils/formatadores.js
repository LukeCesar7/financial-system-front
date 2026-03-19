//Não usa hooks - Transformam dados mas sem lógica no React

//Formatação de um número para padrão de dinheiro brasileiro (R$)
export const formatarBRL = (valor) => {
    const numero = parseFloat(valor) || 0;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numero);
};

//Formatação de uma data para o padrão longo (ex: segunda-feira, xx de março de 20xx)
export const formatarDataLonga = (data) => {
    const d = data instanceof Date ? data : new Date(data);
    return new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(d);
};

//Formatação de data simples (ex: xx/xx/20xx)
export const formatarDataCurta = (dataString) => {
    if (!dataString) return '';
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
};

//Converção 'string' de moeda da entrada (input) : "R$ 1.250,00" -> 1250.00
export const parseMoedaParaNumero = (valorString) => {
    if (!valorString) return 0;
    return parseFloat(valorString.replace(/\./g, '').replace(',', '.'));
};
