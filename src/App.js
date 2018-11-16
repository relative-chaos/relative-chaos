import React, { Component } from 'react';
import logo from './logo-te-logo.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <span>MEM Project</span>
          <span><img src={logo} className="App-logo" alt="logo" /></span>
          <span>relative-chaos</span>
        </header>
        <h4>end-to-end content encryptyon lab</ h4>
        <div className="App-ui">
          <div className="h-box">
            <span><input type="text" placeholder="Открытый ключ собеседника"/></span>
            <span><input type="text" disabled title="Скопировать в буфер" placeholder="Ваш открытый ключ: 2d0fdef52ddbf10ffc6420d14e7a3514a32ded1203cfb8eb5c8bf55c72490b7c74644ee63e8b2855cf7b7af5f23f7a8f6318f5b65ceca6e4c77cecd07d2566ca9f365cb8657d9cb69c9efacb90b7147f7c17363c3410438ea4d096dbcc1322569448d5dfd04b9b551521d426dbd7481c34a11f8e2435a0198d67895a9f5f861336723741700c6673a90bfa92f8a5e0fa279b14bd307b747cd372a5c803ae62ad5019e14b175d01f29dd34dd56e814ae8afd80a757ec10209ba37613b81b072e981ee8631f324570ba3b7f9842e12f59afd90027474e78fae5df1047a7b9b55b7306791420ee6fc2ffab35d8ee34105b49bae5d819196bfab80c741f95338cfa737ca1a338e74c82afb7c79242300d0b98540a62d6ae039cc91b64d984083b4c6463eb238d3d7a8d05f558a479c811c3fafa0e022d0e159025e8e77c4e58bfb13b6e4e46f9126b735396e9ea553fb510243f6a7b58fbed7d6d8791c0a67cdac350f21902f2e09c2b8c5cc27c74edb05879d57f96070deb37d2f5294ed35ccb3b1b5a571c946c706e2ea7bda1337451b915a8f77b1af0cb215920e9d95ec686a6864f89ffc4d4b09b2ff8ccc2d0735d18a91814ae86ac0bad377ec7de279402185aa70caa0bc006d96c5716ddadd80f17d1863e387a1cb9e260c5ff0ce1825633a4fc"/></span>
          </div>
          <div className="h-box">
            <span><textarea placeholder="Шифрованный текст собеседника"/></span>
            <span><textarea placeholder="Ваше сообщение собеседнику"/></span>
          </div>
          <div className="h-box">
            <span><textarea disabled  title="Скопировать в буфер" placeholder="Расшифрованный текст собеседника"/></span>
            <span><textarea disabled  title="Скопировать в буфер" placeholder="Шифрованное сообщение собеседнику"/></span>
          </div>
        </div>
        <h5>2018 © MEM COST Technologies</h5>
      </div>
    );
  }
}

export default App;
