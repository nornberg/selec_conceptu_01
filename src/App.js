import React, { useEffect, useState } from "react";
import { getCoverageData, getMapSvg, getStates } from "./api";
import "./mapClasses.css";
import MapView from "./MapView";
import { Button } from "./ui/buttons";
import { Container, View } from "./ui/views";
import { colorForCoverage, generateSvgUrl, yearsRange } from "./utils";

const App = () => {
  const [svgMap, setSvgMap] = useState(null);
  const [coverageData, setCoverageData] = useState([]);
  const [yearData, setYearData] = useState({ year: null, data: [] });
  const [mapId, setMapId] = useState(null);
  const [years, setYears] = useState([]);

  useEffect(() => {
    // Este effect só é executado uma vez, ao criar o componente.
    // Carrega os dados e converte para formato a ser usado no aplicativo.
    // Gera um array com os anos para usar no menu de botões e outros locais.
    const yearsArray = [];
    for (let y = yearsRange.first; y <= yearsRange.last; y++) {
      yearsArray.push(y);
    }
    setYears(yearsArray);
    // Arquivo de dados, que pode ser hospedado em outro local, facilitando a atualização sem novo deploy.
    getCoverageData().then((srcCoverageData) => {
      getStates().then((states) => {
        states.forEach((state) => {
          yearsArray.forEach((year) => {
            srcCoverageData.push(generateStateCoverageDataForYear(state, year, srcCoverageData));
          });
          setCoverageData(srcCoverageData);
          setMapId(0);
          setYearData({ year: 2010, data: srcCoverageData.filter((entry) => entry.year === 2010) });
        });
      });
    });
  }, []);

  useEffect(() => {
    // Este effect ocorre sempre que troca de mapa.
    getMapSvg(generateSvgUrl(mapId))
      .then((svgText) => {
        setSvgMap(svgText);
      })
      .catch((err) => {
        setSvgMap(null);
      });
  }, [mapId]);

  const generateStateCoverageDataForYear = (state, year, fullCoverageData) => {
    const stateId = Number(state.id);
    let stateAverageCoverage = 0;
    let stateCoverageCount = 0;
    const fullStateCoverageData = fullCoverageData.filter((entry) => entry.idState === stateId && entry.year === year);
    fullStateCoverageData.forEach((entry) => {
      if (!entry.isState && !isNaN(entry.coverage)) {
        stateAverageCoverage += entry.coverage;
        stateCoverageCount++;
      }
    });
    stateAverageCoverage = stateAverageCoverage / stateCoverageCount;
    return {
      id: stateId,
      name: state.nome,
      idState: stateId,
      state: state.sigla,
      year,
      coverage: stateAverageCoverage,
      color: colorForCoverage(stateAverageCoverage),
      isState: true,
    };
  };

  const handleMapClick = (id) => {
    if (id < 100) {
      setMapId(id);
    } else {
      console.log("Show city data for id=", id);
    }
  };

  const handleBackClick = (e) => {
    setMapId(0);
  };

  const handleYearClick = (year) => (e) => {
    setYearData({ year, data: coverageData.filter((entry) => entry.year === year) });
  };

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
      <MapView svgText={svgMap} colorData={yearData.data} onClick={handleMapClick}></MapView>
    </Container>
  );
};

export default App;
