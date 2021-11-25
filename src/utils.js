export const yearsRange = { first: 2010, last: 2019 };

// https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=10
export const coverageColors = [
  "#a50026", // 0 = vermelho, 0%
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#d9ef8b",
  "#a6d96a",
  "#66bd63",
  "#1a9850",
  "#006837", // 9 = verde, 100%
];

export const colorIndexForCoverage = (coverage) => (coverage === 0 ? 0 : Math.trunc((coverage - 1) / 10));

export const colorForCoverage = (coverage) => coverageColors[colorIndexForCoverage(coverage)];

export const generateSvgUrl = (id) =>
  id === null
    ? null
    : id === 0
    ? "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF"
    : `https://servicodados.ibge.gov.br/api/v3/malhas/estados/${id}?formato=image/svg+xml&qualidade=minima&intrarregiao=municipio`;

export const checkCoverage = (coverage) => {
  coverage = Number(coverage);
  if (coverage > 100) {
    // Algumas coberturas estão mal representadas, faltando o ponto decimal.
    // Assumi que são sempre duas casas na parte inteira do número.
    const coverageStr = String(coverage);
    const whole = coverageStr.substring(0, 2);
    const decimal = coverageStr.substring(2);
    coverage = Number(`${whole}.${decimal}`);
  }
  return coverage;
};
