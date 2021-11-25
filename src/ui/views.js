import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  height: 100%;
  background-color: #aaaaaa;
`;

export const View = styled.div`
  display: flex;
  flex-direction: ${(p) => (p.column ? "column" : "row")};
  ${(p) =>
    p.column
      ? `align-items: ${p.align === "start" ? "flex-start" : p.align === "end" ? "flex-end" : "center"};`
      : `justify-content: ${p.align === "start" ? "flex-start" : p.align === "end" ? "flex-end" : "center"};`}
`;

export const ButtonBarView = styled.div`
  display: flex;
  justify-content: center;
`;

export const ViewForMaps = styled.div`
  display: flex;
  justify-content: center;
  max-height: 60%;
`;
