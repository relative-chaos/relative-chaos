import React, { Component } from 'react'
import createECDH from 'create-ecdh'
import BitChaos from './lib/bit-chaos'
import b64 from 'base64-arraybuffer'

import logo from './logo-te-logo.png'
import './App.css';

/* eslint-disable */

// АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ

class App extends Component {

  constructor() {
    super()

    this.ecdh = createECDH('secp521r1')

    this.bc = new BitChaos('')

    this.state = {
      key: this.ecdh.generateKeys(),
      secret: '',
      peerMessage: '',
      message: ''
    }

  }

  onPeerPublicChange({value = null}) {
    if(!value) return;
    try {
      let secret = this.ecdh.computeSecret(new Uint8Array(b64.decode(value)))
      this.setState({ secret })
      this.bc = new BitChaos(secret)
    } catch (e) { console.warn('wrong peer public:', value, b64.decode(value), e) }
  }

  onPeerMessageChange({value = null}) {
    if(!value) return;
    try {
      this.setState({
        peerMessage: this.bc.decrypt(new Uint8Array(b64.decode(value)))
      })
    } catch (e) { console.warn('wrong peer message:', value, e) }
  }

  onMessageChange({value = null}) {
    if(!value) return;
    try {
      this.setState({
        message: b64.encode(this.bc.encrypt(value))
      })
    } catch (e) { console.warn('wrong message:', value, e) }
  }

  copy({value = null}) {
    if(!value) return;
    console.log({navigator})
    // navigator.clipboard.writeText(value).then(console.log, console.error);



    // console.log({value})
    // this.copyArea.value = value
    // console.log('this.copyArea.value', this.copyArea.value)
    // this.copyArea.focus()
    // this.copyArea.select()
    // document.execCommand('copy');
  }

  render() {

    console.log('key:', this.state.key)

    const { key, secret, peerMessage, message } = this.state

    const publicKey = b64.encode(key)

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
            <span><textarea className='key-field' placeholder="Открытый ключ собеседника" onChange={({target = null}) => target && this.onPeerPublicChange(target)}/></span>
            <span><textarea className='key-field' title="Скопировать в буфер" onChange={e=>e} defaultValue={publicKey}/></span>
          </div>

          <div className="h-box">
            <span><textarea placeholder="Шифрованный текст собеседника" onChange={({target = null}) => target && this.onPeerMessageChange(target)}/></span>
            <span><textarea placeholder="Ваше сообщение собеседнику" onChange={({target = null}) => target && this.onMessageChange(target)}/></span>
          </div>

          <div className="h-box">
            <span><textarea disabled onClick={({target = null}) => target && this.copy(target)} title="Скопировать в буфер" placeholder="Расшифрованный текст собеседника" value={peerMessage}/></span>
            <span><textarea disabled onClick={({target = null}) => target && this.copy(target)} title="Скопировать в буфер" placeholder="Шифрованное сообщение собеседнику" value={message}/></span>
          </div>

        </div>

        <h5>2018 © MEM COST Technologies</h5>
      </div>
    );
  }
}
        // <textarea className='copy-area' ref={ref => this.copyArea = ref} onChange={e => e} value=''/>

export default App;


/*

рассмотрим две логические операции: ИЛИ ( | ) и И ( & ) для классических битовых переменных ( двух однобитовых регистра процессора ) X и Y с записью результата в регистр R
операция ИЛИ ( X | Y = "R" )
0 | 0 = 0
0 | 1 = 1
1 | 0 = 1
1 | 1 = 1
операция И ( X & Y = "R" )
0 & 0 = 0
0 & 1 = 0
1 & 0 = 0
1 & 1 = 1
Регистр R может быть представлен как результат операции над регистрами X и Y и так как мы можем совершать над регистрами разные операции, мы можем добавить в систему регистр OP, кодирующий саму операцию
Виртуализация регистра R позволяет кодировать его значения набором значения трёх регистров, что делает значение этого регистра абстрактным и зависимым от интерпретации значений регистров X, OP, Y
Так, мы можем установить, что регистр Y кодирует не второй операнд операции, а её результат. По сути мы просто меняем ролями регистры Y и R и теперь виртуализован у нас второй операнд, а результат задан условием
при таком способе задания значения виртуального регистра, он может принимать следующие состояния

операция ИЛИ ( X | "Y" = R )
однозначно 0
0 | "0" = 0 => 000 = 0
однозначно 1
0 | "1" = 1 => 001 = 1
суперпозиция состояний (и то и другое одновременно)
1 | "0" = 1 => 101 = ?
1 | "1" = 1 => 101 = ?
невозможное состояние (ни то ни другое)
1 | "!" = 0 => 100 = !

операция И ( X & "Y" = R )
суперпозиция состояний (и то и другое одновременно)
0 & "0" = 0 => 010 = ?
0 & "1" = 0 => 010 = ?
невозможное состояние (ни то ни другое)
0 & "!" = 1 => 011 = !
однозначно 0
1 & "0" = 0 => 110 = 0
однозначно 1
1 & "1" = 1 => 111 = 1






























 */

































