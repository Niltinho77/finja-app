import { PrismaClient, TipoTransacao } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categorias = [
    // 💸 SAÍDAS
    { nome: "Alimentação", tipo: TipoTransacao.SAIDA, icone: "🍽️", cor: "#F39C12" },
    { nome: "Assinaturas e serviços", tipo: TipoTransacao.SAIDA, icone: "🔔", cor: "#8E44AD" },
    { nome: "Bares e restaurantes", tipo: TipoTransacao.SAIDA, icone: "🍸", cor: "#F1C40F" },
    { nome: "Cartão de crédito", tipo: TipoTransacao.SAIDA, icone: "💳", cor: "#9B59B6" },
    { nome: "Casa", tipo: TipoTransacao.SAIDA, icone: "🏠", cor: "#8E44AD" },
    { nome: "Compras", tipo: TipoTransacao.SAIDA, icone: "🛍️", cor: "#E91E63" },
    { nome: "Cuidados pessoais", tipo: TipoTransacao.SAIDA, icone: "🧴", cor: "#F4D03F" },
    { nome: "Dívidas e empréstimos", tipo: TipoTransacao.SAIDA, icone: "📄", cor: "#5B2C6F" },
    { nome: "Dízimos e ofertas", tipo: TipoTransacao.SAIDA, icone: "⛪", cor: "#5DADE2" },
    { nome: "Educação", tipo: TipoTransacao.SAIDA, icone: "🎓", cor: "#1ABC9C" },
    { nome: "Família e filhos", tipo: TipoTransacao.SAIDA, icone: "❤️", cor: "#C0392B" },
    { nome: "Fitness", tipo: TipoTransacao.SAIDA, icone: "🏋️‍♂️", cor: "#2980B9" },
    { nome: "Impostos e taxas", tipo: TipoTransacao.SAIDA, icone: "📑", cor: "#D35400" },
    { nome: "Lazer e hobbies", tipo: TipoTransacao.SAIDA, icone: "🎮", cor: "#9B59B6" },
    { nome: "Mercado", tipo: TipoTransacao.SAIDA, icone: "🛒", cor: "#27AE60" },
    { nome: "Pets", tipo: TipoTransacao.SAIDA, icone: "🐾", cor: "#A0522D" },
    { nome: "Presentes e doações", tipo: TipoTransacao.SAIDA, icone: "🎁", cor: "#E91E63" },
    { nome: "Roupas", tipo: TipoTransacao.SAIDA, icone: "👕", cor: "#F39C12" },
    { nome: "Saúde", tipo: TipoTransacao.SAIDA, icone: "💊", cor: "#E74C3C" },
    { nome: "Transporte", tipo: TipoTransacao.SAIDA, icone: "🚌", cor: "#2ECC71" },
    { nome: "Viagem", tipo: TipoTransacao.SAIDA, icone: "✈️", cor: "#16A085" },
    { nome: "Outros", tipo: TipoTransacao.SAIDA, icone: "💰", cor: "#95A5A6" },

    // 💰 ENTRADAS
    { nome: "Aluguel", tipo: TipoTransacao.ENTRADA, icone: "🏘️", cor: "#2ECC71" },
    { nome: "Empréstimos", tipo: TipoTransacao.ENTRADA, icone: "🏦", cor: "#1ABC9C" },
    { nome: "Freelance", tipo: TipoTransacao.ENTRADA, icone: "💻", cor: "#3498DB" },
    { nome: "Investimentos", tipo: TipoTransacao.ENTRADA, icone: "📈", cor: "#1ABC9C" },
    { nome: "Outras receitas", tipo: TipoTransacao.ENTRADA, icone: "➕", cor: "#BDC3C7" },
    { nome: "Presentes", tipo: TipoTransacao.ENTRADA, icone: "🎁", cor: "#F39C12" },
    { nome: "Reembolsos", tipo: TipoTransacao.ENTRADA, icone: "💵", cor: "#16A085" },
    { nome: "Salário", tipo: TipoTransacao.ENTRADA, icone: "⭐", cor: "#27AE60" },
    { nome: "Vendas", tipo: TipoTransacao.ENTRADA, icone: "💸", cor: "#F1C40F" },
  ];

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { nome: cat.nome },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categorias de transações criadas com sucesso!");
}

main().finally(() => prisma.$disconnect());
