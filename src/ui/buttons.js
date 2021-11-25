import styled from "styled-components";

export const Button = styled.button`
  min-width: 100px;
  min-height: 40px;
  border-radius: 5px;
  background-color: ${(p) => (p.active ? "orange" : "white")};
`;
