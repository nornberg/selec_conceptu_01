import { checkCoverage, colorForCoverage } from "./utils";

export const getStates = async () => {
  return await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((statesResponse) => {
    return statesResponse.json();
  });
};

export const getMapSvg = async (svgUrl) => {
  return await fetch(svgUrl).then((svgResponse) => {
    return svgResponse.text();
  });
};

export const getCoverageData = async () => {
  return new Promise((resolve, reject) => {
    fetch(process.env.PUBLIC_URL + "/mun_data_bcg.csv")
      .then((csvResponse) => {
        csvResponse.text().then((csvData) => {
          csvData = csvData.split("\n");
          delete csvData[0];
          // converte os dados CSV para json já com a cor e com a coverage corrigida (ver checkCoverage).
          const coverageData = csvData.map((entry) => {
            const obj = entry.split(",");
            return {
              id: Number(obj[0]),
              name: obj[1],
              idState: Number(obj[2]),
              state: obj[3],
              year: Number(obj[4]),
              coverage: checkCoverage(obj[5]),
              color: colorForCoverage(Number(obj[5])),
              isState: false,
            };
          });
          resolve(coverageData);
        });
      })
      .catch((err) => reject(err));
  });
};
