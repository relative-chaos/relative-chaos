import React, { Component } from 'react'
import createECDH from 'create-ecdh'
import B64 from 'base64-arraybuffer'
// import QR from 'qrcode.react'

import BitChaos from './lib/bit-chaos'

import logo from './logo-te-logo.png'
import './App.css';

/* eslint-disable */

const isClient = typeof window !== 'undefined'

const PATH = typeof location !== 'undefined' ? location.pathname.slice(1) : ''

const LS = isClient ? (id, value = null) => {
  console.log('LS', {id, value})
  if(!value) {
    if(typeof localStorage[id] === 'undefined') return null
    try {
      return JSON.parse(localStorage[id])
    } catch (err) {
      console.error(`Can not parse localStorage[${id}] as JSON:\n${localStorage[id]},\nerror:\n`, err)
    }
  } else try {
    value = JSON.stringify(value)
    localStorage.setItem(id, value)
    return value
  } catch (err) {
    console.error('Can not convert to JSON value', value, '\nerror:\n', err)
  }
  return null
} : () => {}

class App extends Component {

  constructor({ path }) {

    super()

    path = path || PATH

    this.ecdh = createECDH('secp521r1')

    this.bc = new BitChaos('')

    this.state = {
      key: '',
      secret: '',
      peerMessage: '',
      message: ''
    }

  }

  componentDidMount () {

    if(isClient){

      this.setupKeys()

    }

  }

  getState () {
    return this.state
  }

  setupKeys (privateKey = null) {
    if(privateKey) {
      this.ecdh.setPrivateKey(privateKey)
      this.setState({key: this.ecdh.getPublicKey()})
      this.privateKey = privateKey
    } else {
      if(LS) privateKey = LS('privateKey');
      if(privateKey) return this.setupKeys(privateKey);
      this.setState({key: this.ecdh.generateKeys()})
      this.privateKey = this.ecdh.getPrivateKey()
    }
    if(LS) LS('privateKey', this.privateKey)
  }

  onPeerPublicChange({value = null}) {
    if(!value) return;
    try {
      let secret = this.ecdh.computeSecret(new Uint8Array(B64.decode(value.trim())))
      this.setState({ secret })
      this.bc = new BitChaos(secret)
    } catch (e) { console.warn('wrong peer public:', value, B64.decode(value), e) }
  }

  onPeerMessageChange({value = null}) {
    if(!value) return;
    try {
      this.setState({
        peerMessage: this.bc.decrypt(new Uint8Array(B64.decode(value.trim())))
      })
    } catch (e) { console.warn('wrong peer message:', value, e) }
  }

  onMessageChange({value = null}) {
    if(!value) return;
    try {
      this.setState({
        message: B64.encode(this.bc.encrypt(value))
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


    const { key, secret, peerMessage, message } = this.state

    const publicKey = B64.encode(key)
    console.log({key, secret, publicKey})

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
            <span><textarea className='key-field' title="Скопировать в буфер" onChange={e=>e} value={publicKey}/></span>
          </div>

          <div className="h-box">
            <span><textarea placeholder="Шифрованный текст собеседника" onChange={({target = null}) => target && this.onPeerMessageChange(target)}/></span>
            <span><textarea placeholder="Ваше сообщение собеседнику" onChange={({target = null}) => target && this.onMessageChange(target)}/></span>
          </div>

          <div className="h-box">
            <span><textarea onClick={({target = null}) => target && this.copy(target)} title="Скопировать в буфер" placeholder="Расшифрованный текст собеседника" value={peerMessage}/></span>
            <span><textarea onClick={({target = null}) => target && this.copy(target)} title="Скопировать в буфер" placeholder="Шифрованное сообщение собеседнику" value={message}/></span>
          </div>

        </div>

        <h5>2018 © MEM COST Technologies</h5>
        <div className="footer">
          <div className="top-2"><h3>{`Want to be owner of You id\`s?`}</h3></div>
          <div className="top-2">{`Contribute ( Self Security Hand Book comming soon. Please `}<a className="mail-link" href="https://github.com/relative-chaos">{`follow on gihub`}</a>{` )`}</div>
          <div className="top-2">{`Or `}<a className="mail-link" href="https://money.yandex.ru/to/41001821124082">{`Donate`}</a>{`, if you understand, what we do:`}</div>
          <div className="flex top-2">
            <div className="key">
              <p>ETH</p>
              <p className="wallet">0xd0b9e1735ea2c1e2afec712089afc8fcad8906e0</p>
            </div>
            <div className="key left-2">
              <p>BTC</p>
              <p className="wallet">16ghju2oHehczLCcCjRszbYqMrpXpp1pnS</p>
            </div>
            <div className="key">
              <p>DOGE</p>
              <p className="wallet">DCiTowGc2dLLRwY1sEhEBzZ4ZniJL1Hvbn</p>
            </div>
            <div className="key left-2">
              <p>LTC</p>
              <p className="wallet">LNLcMkQD8jogMtfvjCFaMucyXoECUDn8pL</p>
            </div>
          </div>
          <div className="flex top-2">
            <div className="key">
              <p>XMR</p>
              <p className="wallet">4BrL51JCc9NGQ71kWhnYoDRffsDZy7m1HUU7MRU4nUMXAHNFBEJhkTZV9HdaL4gfuNBxLPc3BeMkLGaPbF5vWtANQoshL4x66PkQf8usv5</p>
            </div>
            <div className="key left-2">
              <p>ZEC</p>
              <p className="wallet">t1LJnH6QFP59PL1UokvZ3YtyoJs6B9yQEiR</p>
            </div>
            <div className="key">
              <p>BCH</p>
              <p className="wallet">qzu0j3n5x48d338ngfgvv2h6frltjaxvcsw6347sr7</p>
            </div>
            <div className="key left-2">
              <p>WAVES</p>
              <p className="wallet">3PHcweuuz8mBZUKC6mNX4VNGhkPNX8a7jux</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/*


const bgFrame = typeof location === 'undefined' ? false : /^\/https?:\/\//.test(location.pathname)

        <div {...{ className: css.appView }}>
          { bgFrame && <iframe {...{
            src: `http://evm.mem.chat:${0xBA5E}${typeof location === undefined ? '/' : location.pathname}`,
            sandbox: "allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts",
            allow: "geolocation; microphone; camera; midi; vr",
            allowtransparency: "true",
            allowpaymentrequest: "true",
            allowFullScreen: "true",
            className: css.resultIframe
          }} /> }
        </div>

 */



        // <div className="top-2"><span>{`Ask: `}</span><a className="mail-link" href="mailto:support@mem.chat">{`support@mem.chat`}</a><span className="comment">{`// please encrypt your question for support using this key:`}</span></div>
        // <div className="comment left-4 width-60 top-1">{`BAC1cV8+02UTO0H2I3tiQif9JtcQ5SeZC9hcih8qPe60XTE6SngGA5wsKrrgszJeRAo9nQ1PhFxAGxHCC4WpedZKOQBvjGFQteLZfglpVPYDiZKr1mXwjy2xh4PRdfxwVdrFkmW2olkApopXCliFP67KEO5HdZKp56OYV53PTrj6nOx9wQ==`}</div>
        // <textarea className='copy-area' ref={ref => this.copyArea = ref} onChange={e => e} value=''/>


// https://money.yandex.ru/to/410018135995820

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
0 | "0" = 0 => 010 = 0
однозначно 1
0 | "1" = 1 => 011 = 1
суперпозиция состояний (и то и другое одновременно)
1 | "0" = 1 => 111 = ?
1 | "1" = 1 => 111 = ?
невозможное состояние (ни то ни другое)
1 | "!" = 0 => 110 = !

операция И ( X & "Y" = R )
суперпозиция состояний (и то и другое одновременно)
0 & "0" = 0 => 000 = ?
0 & "1" = 0 => 000 = ?
невозможное состояние (ни то ни другое)
0 & "!" = 1 => 001 = !
однозначно 0
1 & "0" = 0 => 100 = 0
однозначно 1
1 & "1" = 1 => 101 = 1

Так можно закодировать тремя битами виртуальный кубит. Но можем пойти дальше и закодировать тремя кубитами, да потратив в сумме 9 бит на кодирование одного кубита, но полагаю оно того стоит ) При таком подходе, мы можем любую из составляющих опорного триплета содержать в состоянии суперпозиции, например бит операции и имитировать дальнее взаимодействие например путём синхронизации событий по таймеру для двух кубитов независимо от расстояния между ними. Это вроде и не является квантовой запутанностью в физическом смысле, но работает так же, что позволяет предположить, что явление квантовой запутанности возможно между виртуальными состояниями суперпозиции

Bнтересно, достаточно ли будет такого приближения, что бы запустить алгоритм Шора без навороченного квантового кампа ) ?

кстати кейс как заюзать невозможное состояние (в матемактике аналог - это корень из -1 ): кубит операции с невозможным значением может кодировать операцию XOR - исключающее ИЛИ ( X ^ "Y" = R )

однозначно 0
0 ^ "0" = 0
однозначно 1
0 ^ "1" = 1
однозначно 1
1 ^ "0" = 1
однозначно 0
1 ^ "1" = 0

в этом случае нет ни суперпозиции ни невозможного состояния и проц переходит в классический режим обычной бинарной логики




-----------------------------------------

MEM T-Comunity
        мастера своего дела

























 */

































