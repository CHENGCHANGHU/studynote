import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Catalog from "./components/catalog";
import ChapterContainer from "./components/chapter-container";
import * as data from "./staticData";
console.log(data.default.header);

ReactDOM.render(
  <React.StrictMode>

    {/* <App /> */}
    <header>{data.default.header}</header>

    <Catalog />
    <ChapterContainer chapters={data.default.chapters}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// 模块热更新
if (module.hot) {
  module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();