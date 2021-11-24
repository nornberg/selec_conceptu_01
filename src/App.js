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

const App = () => {
  const [svgMap, setSvgMap] = useState(null);
  const [colorData, setColorData] = useState([]);
  const [year, setYear] = useState(2010);
  const [mapId, setMapId] = useState(null);

  useEffect(() => {
    console.log("[App.useEffect 1]");
    fetch(process.env.PUBLIC_URL + "/mun_data_bcg.csv").then((csvResponse) => {
      csvResponse.text().then((text) => {
        text = text.split("\n");
        delete text[0];
        const colorIndex = (coverage) => (coverage === 0 ? 0 : Math.trunc((coverage - 1) / 10));
        const coverageData = text.map((entry) => {
          const obj = entry.split(",");
          return { id: obj[0], year: obj[4], coverage: obj[5], color: coverageColors[colorIndex(obj[5])] };
        });
        console.log("[App.useEffect 1][setColorData]");
        setColorData(coverageData);
      });
    });
  }, []);

  useEffect(() => {
    console.log("[App.useEffect 2]");
    //console.log("[App.useEffect 2] Clearing current svg...");
    //setSvgMap(null);
    const svgUrl = generateSvgUrl(mapId);
    fetch(svgUrl).then((svgResponse) => {
      svgResponse.text().then((text) => {
        console.log("[App.useEffect 2][setSvgMap]");
        setSvgMap(text);
      });
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
    console.log("[App.handleYearClick] ", year, e.target);
    setYear(year);
  };

  const generateSvgUrl = (id) =>
    !id
      ? "https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=intermediaria&intrarregiao=UF"
      : `https://servicodados.ibge.gov.br/api/v3/malhas/estados/${id}?formato=image/svg+xml&qualidade=minima&intrarregiao=municipio`;

  console.log("[App.render] ");
  return (
    <Container>
      <View>Indicadores de saúde do Brasil</View>
      <View>Cobertura da vacinação BCG</View>
      <View>
        <Button onClick={handleBackClick}>Voltar</Button>
      </View>
      <View>
        <Button onClick={handleYearClick(2010)} active={year === 2010}>
          2010
        </Button>
        <Button onClick={handleYearClick(2011)} active={year === 2011}>
          2011
        </Button>
      </View>
      <MapView SvgComp={svgMap} colorData={colorData} onClick={handleMapClick}></MapView>
    </Container>
  );
};

export default App;
