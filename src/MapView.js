import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";

const ViewForMaps = styled.div`
  display: flex;
  background-color: #aaaaaa;
`;

const MapView = ({ SvgComp: SvgText, colorData, onClick }) => {
  useEffect(() => {
    console.log("[MapView.useEffect] SvgComp=", SvgText != null, " colorData=", colorData.length > 0);
    if (SvgText && colorData && colorData.length > 0) {
      console.log("[MapView.useEffect] Coloring the map");
      colorData.forEach((cd) => {
        const path = document.getElementById(cd.id);
        if (path) path.style.fill = cd.color;
      });
    }
  }, [SvgText, colorData]);

  const mapCssClasses = ["clicked", "pointed", "notPointed"];
  let mouseOverElement = null;

  const handleMouseOver = (e) => {
    if (mouseOverElement) {
      setMouseOverClass(mouseOverElement, "notPointed");
      mouseOverElement = null;
    }
    if (e.target.id) {
      mouseOverElement = e.target;
      setMouseOverClass(mouseOverElement, "pointed");
    }
  };

  const setMouseOverClass = (element, className) => {
    // Remove uma classe mesmo que ela vá ser adicionada novamente, para que a animação dela reinicie.
    mapCssClasses.forEach((cName) => element.classList.remove(cName));
    element.classList.add(className);
  };

  console.log("[MapView.render]");
  if (!SvgText) return null;
  SvgText = SvgText.replace(/width="[0-9]+"/, "");
  const SvgTextWithoutSizeToFitInDiv = SvgText.replace(/height="[0-9]+"/, "");

  return (
    <ViewForMaps
      dangerouslySetInnerHTML={{ __html: SvgTextWithoutSizeToFitInDiv }}
      onClick={(e) => {
        if (e.target.id) {
          e.target.classList.remove("clicked");
          setTimeout(() => {
            e.target.classList.add("clicked");
          }, 10);
          onClick(e.target.id);
        }
      }}
      onMouseOver={handleMouseOver}
    />
  );
};

export default MapView;
