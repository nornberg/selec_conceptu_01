import React from "react";
import { useEffect } from "react";
import { ViewForMaps } from "./ui/views";

const MapView = ({ svgText: svgText, colorData, onClick }) => {
  useEffect(() => {
    if (svgText && colorData && colorData.length > 0) {
      colorData.forEach((cd) => {
        const path = document.getElementById(cd.id);
        if (path) path.style.fill = cd.color;
      });
    }
  }, [svgText, colorData]);

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

  if (!svgText) return null;
  svgText = svgText.replace(/width="[0-9]+"/, "");
  const SvgTextWithoutSizeToFitInDiv = svgText.replace(/height="[0-9]+"/, "");

  return (
    <ViewForMaps
      dangerouslySetInnerHTML={{ __html: SvgTextWithoutSizeToFitInDiv }}
      onClick={(e) => {
        if (e.target.id) {
          e.target.classList.remove("clicked");
          setTimeout(() => {
            e.target.classList.add("clicked");
          }, 10);
          onClick(Number(e.target.id));
        }
      }}
      onMouseOver={handleMouseOver}
    />
  );
};

export default MapView;
