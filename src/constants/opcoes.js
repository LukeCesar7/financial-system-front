// Listas ->  Todas as categorias para evitar poluição do código ou erros de digitação.
import {
    IconTrendingUp, IconList, IconToolsKitchen2, IconReceipt, IconCar, IconShoppingBag, IconBasket,
    IconBuildingBank, IconFirstAidKit, IconReceiptTax, IconPlane, IconBriefcase, IconSchool,
    IconHanger, IconDeviceTv, IconTicket, IconDeviceDesktop, IconBallFootball, IconUsers,
    IconPaw, IconHome, IconHeartHandshake, IconFileDescription, IconChartLine, IconDice5, IconDots,
    IconApps
} from '@tabler/icons-react';

export const listaCategorias = [
    'Renda', 'Pendente de categoria', 'Comida e bebida', 'Contas e serviços', 'Transporte',
    'Compras', 'Supermercado', 'Empréstimos', 'Saúde e cuidados pessoais', 'Taxas',
    'Viagens', 'Serviços profissionais', 'Educação', 'Roupas', 'Assinaturas digitais',
    'Entretenimento', 'Eletrônicos', 'Esportes', 'Amizades e família', 'Animais de estimação',
    'Casa', 'Doações', 'Impostos', 'Investimentos', 'Jogos de azar', 'Outros'
];

export const listaCategoriasFiltro = ['Todas as categorias', ...listaCategorias];

export const corBadgeCategoria = {
    'Todas as categorias': 'dark',
    'Renda': 'green', 'Pendente de categoria': 'gray', 'Comida e bebida': 'red', 'Contas e serviços': 'pink',
    'Transporte': 'blue', 'Compras': 'grape', 'Supermercado': 'green', 'Empréstimos': 'orange',
    'Saúde e cuidados pessoais': 'teal', 'Taxas': 'violet', 'Viagens': 'indigo', 'Serviços profissionais': 'gray',
    'Educação': 'cyan', 'Roupas': 'pink', 'Assinaturas digitais': 'blue', 'Entretenimento': 'yellow',
    'Eletrônicos': 'cyan', 'Esportes': 'orange', 'Amizades e família': 'red', 'Animais de estimação': 'lime',
    'Casa': 'yellow', 'Doações': 'teal', 'Impostos': 'red', 'Investimentos': 'green', 'Jogos de azar': 'violet', 'Outros': 'gray'
};

export const iconePorCategoria = {
    'Todas as categorias': IconApps,
    'Renda': IconTrendingUp, 'Pendente de categoria': IconList, 'Comida e bebida': IconToolsKitchen2,
    'Contas e serviços': IconReceipt, 'Transporte': IconCar, 'Compras': IconShoppingBag,
    'Supermercado': IconBasket, 'Empréstimos': IconBuildingBank, 'Saúde e cuidados pessoais': IconFirstAidKit,
    'Taxas': IconReceiptTax, 'Viagens': IconPlane, 'Serviços profissionais': IconBriefcase,
    'Educação': IconSchool, 'Roupas': IconHanger, 'Assinaturas digitais': IconDeviceTv,
    'Entretenimento': IconTicket, 'Eletrônicos': IconDeviceDesktop, 'Esportes': IconBallFootball,
    'Amizades e família': IconUsers, 'Animais de estimação': IconPaw, 'Casa': IconHome,
    'Doações': IconHeartHandshake, 'Impostos': IconFileDescription, 'Investimentos': IconChartLine,
    'Jogos de azar': IconDice5, 'Outros': IconDots
};

export const listaAnos = ['2025', '2026', '2027', '2028', '2029', '2030'];

//Otimização de código
export const listaMeses = Array.from({ length: 12 }, (_, i) => {
    const nomeMes = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(2024, i));
    return {
        value: String(i + 1),
        // charAt --> Letra Maiúscula(primeira(0))
        label: nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)
    };
});