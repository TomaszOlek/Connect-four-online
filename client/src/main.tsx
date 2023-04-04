import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { io } from "socket.io-client";
import { createGlobalStyle } from "styled-components";

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index";
import { Provider } from "react-redux";

const GlobalStyle = createGlobalStyle`
  body,html,#root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  p,h1,h2,h3,h4,h5,h6,li {
    font-family: 'Roboto', sans-serif;
    margin: 0;
  }
  ul{
    margin: 0;
  }
`;
// const PORT = process.env.PORT || 3001

const socket = io("http://localhost:3001");
let store = configureStore({ reducer: rootReducer });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <Provider store={store}>
      <App socket={socket} />
    </Provider>
  </React.StrictMode>
);
