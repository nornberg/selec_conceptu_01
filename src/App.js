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

const App = () => {
  const [svgMap, setSvgMap] = useState(null);
  const [colorData, setColorData] = useState([]);
  const [svgUrl, setSvgUrl] = useState(
    "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF"
  );

  useEffect(() => {
    console.log("[App.useEffect]");
    let coverageData = [];
    Promise.all([fetch(svgUrl), fetch(process.env.PUBLIC_URL + "/mun_data_bcg.csv")]).then((allData) => {
      const svgResponse = allData[0];
      svgResponse.text().then((text) => {
        console.log("[App.useEffect][setSvgMap]");
        setSvgMap(text);
        const csvResponse = allData[1];
        csvResponse.text().then((text) => {
          text = text.split("\n");
          delete text[0];
          const colorIndex = (coverage) => (coverage === 0 ? 0 : Math.trunc((coverage - 1) / 10));
          coverageData = text.map((entry) => {
            const obj = entry.split(",");
            return { id: obj[0], year: obj[4], coverage: obj[5], color: coverageColors[colorIndex(obj[5])] };
          });
          console.log("[App.useEffect][setColorData]");
          setColorData(coverageData);
        });
      });
    });
  }, [svgUrl]);

  const handleMapClick = (id) => {
    if (id === "2401453") {
      console.log("[App.handleMapClick] Setting svgURL for BRASIL");
      setSvgUrl(
        "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF"
      );
    } else if (Number(id) < 100) {
      console.log("[App.handleMapClick] Setting svgURL for UF " + id);
      setSvgUrl(
        "https://servicodados.ibge.gov.br/api/v3/malhas/estados/24?formato=image/svg+xml&qualidade=minima&intrarregiao=municipio"
      );
    } else {
      console.log("[App.handleMapClick] Ignored city " + id);
    }
  };

  console.log("[App.render]");
  return (
    <Container>
      <View>Indicadores de saúde do Brasil</View>
      <View>Cobertura da vacinação BCG</View>
      <View>Slider</View>
      <MapView SvgComp={svgMap} colorData={colorData} onClick={handleMapClick}></MapView>
    </Container>
  );
};

export default App;
