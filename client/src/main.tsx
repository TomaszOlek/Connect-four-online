import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { io } from "socket.io-client";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body,html,#root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  p,h1,h2,h3,h4,h5,h6 {
    font-family: 'Roboto', sans-serif;
    margin: 0;
  }
`;

const socket = io("http://localhost:3001");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <App socket={socket} />
  </React.StrictMode>
);
