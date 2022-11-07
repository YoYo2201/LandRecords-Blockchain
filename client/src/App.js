import React, { Component } from "react";
import web3Connection from './web3Connection';
import Contract from './Contract';
import Formate from './utils/Formate';
import 'semantic-ui-css/semantic.min.css'
import { Menu, Divider } from "semantic-ui-react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn"
import SignOut from "./components/SignOut";
import "./App.css";
import Spinner from './Spinner';
import Alert from './Alert';
import Sell from './components/Sell';
import Properties from "./components/Properties";
import AdminSignIn from "./components/AdminSignIn";
import AdminSignUp from "./components/AdminSignUp";
import AllotProperty from "./components/AllotProperty";
import Sendotp from "./components/sendOTP";
import Receiveotp from "./components/receiveOTP";
import SellContinue from "./components/SellContinue";

class App extends Component {
  state = {
    web3: null,
    account: null,
    contract: null,
    balance: null,
    activeItem: 'home',
    signedUp: false,
    loggedIn: false,
    username: '',
    password: 'visibility',
    code: "visibility",
    load: false,
    disable: false,
    alert: null,
    connectStatus: 'Connect',
    disableButton: false,
    govLoggedIn: false,
    govUsername: '',
    HomePageActive: true,
    index: null,
    property: null
  };

  navigator = (position, replace) => {  
    this.props.navigate(position, { replace: replace })
  }

  setStateData = (element, data) => {
    if(element === 'alert')
    {
      this.setState({
        alert: data,   
      });
    }
    else if(element === 'load')
    {
      this.setState({
        load: data,   
      });
    }
    else if(element === 'data')
    {
      this.setState({
        data: data,   
      });
    }
    else if(element === 'disable') {
      this.setState({
        disable: data,
      });
    }
    else if(element === 'HomePageActive') {
      this.setState({
        HomePageActive: data,
      }, this.titleColorChange);
    }
    else if(element === 'index') {
      this.setState({
        index: data,
      });
    }
    else if(element === 'property') {
      this.setState({
        property: data,
      });
    }
  }

  passwordHandle = (id, flag) => {
    let x = document.getElementById(id);
  if (x.type === "password") {
    x.type = "text";
    if(flag === 1)
      this.setState({password: "visibility_off"});
    else
      this.setState({code: "visibility_off"});
  } else {
    x.type = "password";
    if(flag === 1)
      this.setState({password: "visibility"});
    else
      this.setState({code: "visibility"});
  }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name, color: 'teal' })

  ConnectToWallet = async () => {
    if(this.state.connectStatus === 'Connected')
      this.handleAlert("danger", "Already Connected!");
    else {
    try {
      const web3 = await web3Connection();
      const contract = await Contract(web3);
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3: web3, contract: contract, account: accounts[0] }, this.start);
      this.setState({connectStatus: 'Connected', disableButton: true});
      await this.getAccount();
    } catch (error) {
      this.handleAlert("danger", "Unable to Connect!!!");
    }
  }
  };

  start = async () => {
    await this.getAccount();
    const { web3, contract, account } = this.state;
    console.log(this.state.contract)
  };

  getAccount = async () => {
    if (this.state.web3 !== null || this.state.web3 !== undefined) {
      await window.ethereum.on('accountsChanged', async (accounts) => {
        this.setState({
          account: accounts[0],
          loggedIn: false
        });

        this.state.web3.eth.getBalance(accounts[0], (err, balance) => {
          if (!err) {
            this.setState({ balance: Formate(this.state.web3.utils.fromWei(balance, 'ether')) });
          }
        });
      });
    }
  }

  accountCreated = async (signedUp) => {
    this.setState({ signedUp: signedUp });
  }

  userSignedIn = async (loggedIn, username) => {
    this.setState({ loggedIn: loggedIn, username: username });
  }

  govSignedIn = async (loggedIn, username) => {
    this.setState({ govLoggedIn: loggedIn, govUsername: username });
  }

  titleColorChange = () => {
    let text = document.getElementById("title").style;
    if(this.state.HomePageActive === true)
      text.backgroundColor = "white";
    else
      text.backgroundColor = "black";
  }

  loggedOut = async (loggedIn) => {
    this.setState({ loggedIn: loggedIn }, this.setNavBarWidth);
    this.navigator('/', true);
  }

  govLoggedOut = async (loggedIn) => {
    this.setState({ govLoggedIn: loggedIn }, this.setNavBarWidth);
    this.navigator('/', true);
  }

  initialize = () => {
    this.setState({password: 'visibility', code: 'visibility'})
  }

  handleAlert = (flag, msg) => {
    if (flag === "success") {
      this.setState({
      alert: {
        msg: msg,
        d: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z",
        type: flag,
      }
    });

      setTimeout(() => {
        this.setState({
          alert: null
        })
      }, 1800);
    } else {
      this.setState({
      alert: {
        msg: msg,
        d: "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
        type: flag,
      }
    });

      setTimeout(() => {
        this.setState({
          alert: null
        })
      }, 1800);
    }
  };

  makeBlur = (flag) => {
    let bg = document.getElementById("Background").style;
    if(flag === 1)
      bg.filter = 'blur(2px)';
    else
      bg.filter = '';
  }

  changeRoute = (route, replace) => {
    this.navigator(route, replace);
  }

  componentDidMount = () => {
    let nav = document.getElementsByClassName("navBar");
    if(this.state.loggedIn)
      nav[0].style.width = "900px";
    else
      nav[0].style.width = "600px";
    this.titleColorChange();
  }

  setNavBarWidth = () => {
    let nav = document.getElementsByClassName("navBar");
    if(this.state.loggedIn)
      nav[0].style.width = "500px";
    else
      nav[0].style.width = "600px";
  }

  render() {
    const { activeItem, color } = this.state;
    return (
      <div className="App">
        {this.state.load && <Spinner/>}
        {this.state.alert !== null ? <Alert alert={this.state.alert}/> : undefined}
        <div className="main-page" id="Background">
          <p id="title">LandRecords</p>
          <div className="navBar"> 
            <button type="button" className="navBarbutton" onClick={() => this.changeRoute('/', true)}>Home</button>
            {this.state.loggedIn ?<>
            <button type="button" className="navBarbutton" onClick={() => this.changeRoute('/sell', false)}>Sell</button>
            <button type="button" className="navBarbutton" onClick={() => this.changeRoute('/sign-out', false)}>Sign Out</button></> : this.state.govLoggedIn ? <>
            <button type="button" className="navBarbutton" onClick={() => this.changeRoute('/admin/sign-out', false)}>Sign Out</button></> : <><button type="button" className="navBarbutton" onClick={() => this.changeRoute('/sign-in', false)}>User Login</button><button type="button" className="navBarbutton" onClick={() => this.changeRoute('/admin/sign-in', false)}>Admin Login</button></>}
            <button type="button" className=" Searching btn btn-outline-success my-2 my-sm-0" id="ConnectButton" onClick={this.ConnectToWallet}><p id="connectText">{this.state.connectStatus}</p></button>
          </div>
            <Routes>
              <Route exact path='/' element={<Home changeRoute={this.changeRoute} state={this.state} setStateData={this.setStateData}/>}></Route>
              
              <Route path='/sell' element={<Sell changeRoute={this.changeRoute}
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              passwordHandle={this.passwordHandle}
              state={this.state}
              navigator={this.navigator}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route>

            <Route path='/sell/1' element={<SellContinue
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              passwordHandle={this.passwordHandle}
              state={this.state}
              navigator={this.navigator}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route>

          <Route path='/api/sendOTP' element={<Sendotp changeRoute={this.changeRoute}
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              passwordHandle={this.passwordHandle}
              state={this.state}
              navigator={this.navigator}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route>

          <Route path='/api/receiveOTP' element={<Receiveotp changeRoute={this.changeRoute}
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              passwordHandle={this.passwordHandle}
              state={this.state}
              navigator={this.navigator}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route>

            <Route exact path='/api/properties' element={<Properties
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              state={this.state}
              navigator={this.navigator}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route>

                <Route path='/sign-in' element={
                    <SignIn
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      signedUp={this.state.signedUp}
                      userSignedIn={this.userSignedIn}
                      navigator={this.navigator}
                      passwordHandle={this.passwordHandle}
                      state={this.state}
                      initialize={this.initialize}
                      setStateData={this.setStateData}
                      makeBlur={this.makeBlur}
                      alertFunc={this.handleAlert}
                      setNavBarWidth={this.setNavBarWidth}
                    />
                }></Route>

                  <Route path='/api/allot/property' element={
                    <AllotProperty
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      signedUp={this.state.signedUp}
                      userSignedIn={this.userSignedIn}
                      navigator={this.navigator}
                      passwordHandle={this.passwordHandle}
                      state={this.state}
                      initialize={this.initialize}
                      setStateData={this.setStateData}
                      makeBlur={this.makeBlur}
                      alertFunc={this.handleAlert}
                      setNavBarWidth={this.setNavBarWidth}
                    />
                }></Route>
                  
                  <Route path='/sign-out' element={<SignOut
                    loggedOut={this.loggedOut}
                    setNavBarWidth={this.setNavBarWidth}
                  />}></Route>
                  
                  <Route path='/sign-up' element={<SignUp
                    web3={this.state.web3}
                    contract={this.state.contract}
                    account={this.state.account}
                    accountCreated={this.accountCreated}
                    passwordHandle={this.passwordHandle}
                    state={this.state}
                    initialize={this.initialize}
                    setStateData={this.setStateData}
                    makeBlur={this.makeBlur}
                    navigator={this.navigator}
                    alertFunc={this.handleAlert}
                    setNavBarWidth={this.setNavBarWidth}
                  />}></Route>

            {/* <Route path='/admin/transaction' element={<Transaction changeRoute={this.changeRoute}
              web3={this.state.web3}
              contract={this.state.contract}
              account={this.state.account}
              signedUp={this.state.signedUp}
              userSignedIn={this.userSignedIn}
              ConnectToWallet={this.ConnectToWallet}
              passwordHandle={this.passwordHandle}
              state={this.state}
              initialize={this.initialize}
              setStateData={this.setStateData}
              makeBlur={this.makeBlur}
              alertFunc={this.handleAlert}
              setNavBarWidth={this.setNavBarWidth}/>}></Route> */}

                  <Route path='/admin/sign-in' element={
                    <AdminSignIn
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      signedUp={this.state.signedUp}
                      govSignedIn={this.govSignedIn}
                      navigator={this.navigator}
                      passwordHandle={this.passwordHandle}
                      state={this.state}
                      initialize={this.initialize}
                      setStateData={this.setStateData}
                      makeBlur={this.makeBlur}
                      alertFunc={this.handleAlert}
                      setNavBarWidth={this.setNavBarWidth}
                    />
                }></Route>
                  
                  <Route path='/admin/sign-out' element={<SignOut
                    loggedOut={this.govLoggedOut}
                    setNavBarWidth={this.setNavBarWidth}
                  />}></Route>
                  
                  <Route path='/admin/sign-up' element={<AdminSignUp
                    web3={this.state.web3}
                    contract={this.state.contract}
                    account={this.state.account}
                    accountCreated={this.accountCreated}
                    passwordHandle={this.passwordHandle}
                    state={this.state}
                    initialize={this.initialize}
                    setStateData={this.setStateData}
                    makeBlur={this.makeBlur}
                    navigator={this.navigator}
                    alertFunc={this.handleAlert}
                    setNavBarWidth={this.setNavBarWidth}
                  />}></Route>
            </Routes>
        </div>
      </div>
    );
  }
}

function WithNavigate(props) {
  let navigate = useNavigate();
  return <App navigate={navigate} />
}

export default WithNavigate;
