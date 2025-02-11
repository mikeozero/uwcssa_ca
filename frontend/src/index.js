import "./index.css";

import App from "./App";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
console.log(
  `%c                                 
   _   ___        ______ ____ ____    _    
  | | | \\ \\      / / ___/ ___/ ___|  / \\   
  | | | |\\ \\ /\\ / / |   \\___ \\___ \\ / _ \\  
  | |_| | \\ V  V /| |___ ___) |__) / ___ \\ 
   \\___/   \\_/\\_/  \\____|____/____/_/   \\_\\     
                                           
   A Student Community like No Other.
   任何一个傻瓜都会写能够让机器理解的代码，只有好的程序员才能写出人类可以理解的代码。——Martin Fowler
`,
  `font-family: monospace`
);
