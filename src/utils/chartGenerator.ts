// src/utils/chartGenerator.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Import robusto que funciona com ESM/CJS e evita o erro “não construível”
import * as QuickChartNS from "quickchart-js";
const QuickChart: any = (QuickChartNS as any).default ?? QuickChartNS;

// Resolves de caminho em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gera gráfico de pizza (categorias x valores) e salva como PNG.
 * Retorna o caminho absoluto do arquivo gerado.
 */
export async function gerarGraficoPizza(labels: string[], valores: number[]) {
  const chart = new QuickChart();

  chart.setWidth(700);
  chart.setHeight(420);
  chart.setBackgroundColor("#ffffff");

  chart.setConfig({
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: valores,
          borderWidth: 2,
          borderColor: "#ffffff",
          backgroundColor: [
            "#36A2EB", "#FF6384", "#FFCE56", "#4BC0C0", "#9966FF",
            "#FF9F40", "#8DD17E", "#C49C94", "#B39CD0", "#F7786B",
          ],
        },
      ],
    },
    options: {
      layout: { padding: 18 },
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#333", font: { size: 12 } },
        },
        title: {
          display: true,
          text: "Distribuição por Categoria",
          color: "#111",
          font: { size: 16, weight: "bold" },
        },
        tooltip: {
          callbacks: {
            label: {
              // apenas ilustração; QuickChart aceita callbacks limitados
              // manter simples para compatibilidade
            },
          },
        },
      },
    },
  });

  const buffer: Buffer = await chart.toBinary(); // imagem PNG

  const fileName = `chart_${Date.now()}.png`;
  const outPath = path.join(__dirname, "..", "..", fileName);
  fs.writeFileSync(outPath, buffer);

  return outPath;
}
