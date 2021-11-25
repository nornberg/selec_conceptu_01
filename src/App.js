import React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import "./mapClasses.css";
import MapView from "./MapView";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  background-color: lightblue;
`;

const View = styled.div`
  display: flex;
  border: 1px red solid;
`;

const Button = styled.button`
  min-width: 100px;
  min-height: 40px;
  border-radius: 5px;
  background-color: ${(p) => (p.active ? "orange" : "white")};
`;

// https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=10
const coverageColors = [
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

const yearsRange = { first: 2010, last: 2019 };

const App = () => {
  const [svgMap, setSvgMap] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [yearData, setYearData] = useState({ year: null, data: [] });
  const [mapId, setMapId] = useState(null);
  const [years, setYears] = useState([]);

  useEffect(() => {
    console.log("[App.useEffect 1]");
    const yearsArray = [];
    for (let y = yearsRange.first; y <= yearsRange.last; y++) {
      yearsArray.push(y);
    }
    setYears(yearsArray);
    fetch(process.env.PUBLIC_URL + "/mun_data_bcg.csv").then((csvResponse) => {
      csvResponse.text().then((text) => {
        text = text.split("\n");
        delete text[0];
        const colorIndex = (coverage) => (coverage === 0 ? 0 : Math.trunc((coverage - 1) / 10));
        const newFullData = text.map((entry) => {
          const obj = entry.split(",");
          let coverage = Number(obj[5]);
          if (coverage > 100) {
            const coverageStr = String(coverage);
            const whole = coverageStr.substring(0, 2);
            const decimal = coverageStr.substring(2);
            coverage = Number(`${whole}.${decimal}`);
            console.log(`Correcting coverage from ${coverageStr} to ${coverage} for ${obj[1]}/${obj[3]} in ${obj[4]}`);
          }
          return {
            id: Number(obj[0]),
            name: obj[1],
            idState: Number(obj[2]),
            state: obj[3],
            year: Number(obj[4]),
            coverage,
            color: coverageColors[colorIndex(Number(obj[5]))],
            isState: false,
          };
        });
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then((statesResponse) => {
          statesResponse.json().then((states) => {
            yearsArray.forEach((year) => {
              states.forEach((currentState) => {
                let currentStateAverageCoverage = 0;
                let currentStateCoverageCount = 0;
                const fullDataForCurrentState = newFullData.filter(
                  (entry) => entry.idState === Number(currentState.id)
                );
                fullDataForCurrentState.forEach((entry) => {
                  if (!entry.isState && !isNaN(entry.coverage)) {
                    currentStateAverageCoverage += entry.coverage;
                    currentStateCoverageCount++;
                  }
                });
                currentStateAverageCoverage = currentStateAverageCoverage / currentStateCoverageCount;
                newFullData.push({
                  id: Number(currentState.id),
                  name: currentState.nome,
                  idState: Number(currentState.id),
                  state: currentState.sigla,
                  year,
                  coverage: currentStateAverageCoverage,
                  color: coverageColors[colorIndex(currentStateAverageCoverage)],
                  isState: true,
                });
              });
            });
            console.log("[App.useEffect 1][setFullData]");
            setFullData(newFullData);
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    console.log("[App.useEffect 2]");
    const svgUrl = generateSvgUrl(mapId);
    fetch(svgUrl)
      .then((svgResponse) => {
        svgResponse.text().then((text) => {
          console.log("[App.useEffect 2][setSvgMap]");
          setSvgMap(text);
        });
      })
      .catch((err) => {
        console.log("[App.useEffect 2] Clearing current svg...");
        setSvgMap(null);
      });
  }, [mapId]);

  const handleMapClick = (id) => {
    id = Number(id);
    console.log("[App.handleMapClick] Clicked id=" + id);
    if (id < 100) {
      setMapId(id);
    } else {
      console.log("Show city data for id=", id);
    }
  };

  const handleBackClick = (e) => {
    console.log("[App.handleBackClick] ");
    setMapId(null);
  };

  const handleYearClick = (year) => (e) => {
    console.log("[App.handleYearClick] ", year);
    const newYearData = fullData.filter((entry) => entry.year === year);
    setYearData({ year, data: newYearData });
  };

  const generateSvgUrl = (id) =>
    !id
      ? "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF"
      : `https://servicodados.ibge.gov.br/api/v3/malhas/estados/${id}?formato=image/svg+xml&qualidade=minima&intrarregiao=municipio`;

  console.log("[App.render] ", yearData);
  return (
    <Container>
      <View>Indicadores de saúde do Brasil</View>
      <View>Cobertura da vacinação BCG</View>
      <View>
        <Button onClick={handleBackClick}>Voltar</Button>
      </View>
      <View style={{ flexWrap: "wrap" }}>
        {years.map((year) => (
          <Button key={year} onClick={handleYearClick(year)} active={yearData.year === year}>
            {year}
          </Button>
        ))}
      </View>
      <MapView SvgComp={svgMap} colorData={yearData.data} onClick={handleMapClick}></MapView>
    </Container>
  );
};

export default App;
