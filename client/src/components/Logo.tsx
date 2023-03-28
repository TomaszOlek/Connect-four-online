import styled from "styled-components";
import { Icon } from "@iconify/react";

function Logo() {
  return (
    <LogoConteiner>
      <RedChip />
      <YelloChip />
    </LogoConteiner>
  );
}

export default Logo;

const LogoConteiner = styled.div`
  cursor: pointer;

  position: relative;

  display: flex;
  justify-content: center;
  gap: -40px;
  width: 1px;
  height: 50px;
`;

const RedChip = styled.div`
  content: "";
  width: 50px;
  height: 50px;
  margin: 5px;

  position: absolute;
  left: -40px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  background-color: #eb607e;

  box-shadow: inset 1px 1px 1px #c33957, inset -1px -1px 1px #8b122c,
    inset 2px 2px 2px #d34a68, inset -2px -2px 8px #ae324d;

  &::after {
    content: "";
    width: 30px;
    height: 30px;

    box-shadow: inset 1px 1px 1px #a11e3a, inset -1px -1px 1px #a11a37,
      inset 2px 2px 2px #99233d, inset -2px -2px 8px #b0425a;
    border-radius: 50%;
    filter: blur(1px);
  }
`;

const YelloChip = styled.div`
  content: "";
  width: 50px;
  height: 50px;
  margin: 5px;

  position: absolute;
  left: -10px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  background-color: #ffcf68;

  box-shadow: inset 1px 1px 1px #cd9e38, inset -1px -1px 1px #a67e27,
    inset 2px 2px 2px #d1a958, inset -2px -2px 8px #c69a3a;

  &::after {
    content: "";
    width: 29px;
    height: 29px;
    box-shadow: inset 1px 1px 1px #cea754, inset -1px -1px 1px #a27c2a,
      inset 2px 2px 2px #b48c36, inset -2px -2px 8px #cc9f3f;
    border-radius: 50%;
    filter: blur(1px);
    border: 1px solid #b7851a;
  }
`;

// inset 1px 1px 1px #bb0e33, inset -1px -1px 1px #bc0f35
