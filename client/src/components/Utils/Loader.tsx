import styled, { keyframes } from "styled-components";

const Loader = () => {
  return (
    <LoaderContainer>
      <Dot />
      <Dot />
      <Dot />
      <Dot />
    </LoaderContainer>
  );
};
export default Loader;

const LoaderContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
`;
const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(6px, 0);
  }
`;
const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;
const Dot = styled.div`
  position: absolute;
  top: 10px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #000000;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);

  &:nth-child(1) {
    left: 2px;
    animation: ${ldsEllipsis1} 0.6s infinite;
  }
  &:nth-child(2) {
    left: 2px;
    animation: ${ldsEllipsis2} 0.6s infinite;
  }
  &:nth-child(3) {
    left: 7px;
    animation: ${ldsEllipsis2} 0.6s infinite;
  }
  &:nth-child(4) {
    left: 13px;
    animation: ${ldsEllipsis3} 0.6s infinite;
  }
`;
