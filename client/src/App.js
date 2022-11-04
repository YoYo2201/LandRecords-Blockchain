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
import UserAccount from './components/UserAccount';
import "./App.css";
import Spinner from './Spinner';
import Alert from './Alert';

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
    disableButton: false
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
    try {
      const web3 = await web3Connection();
      const contract = await Contract(web3);
      const accounts = await web3.eth.getAccounts();

      this.setState({ web3: web3, contract: contract, account: accounts[0] }, this.start);
      this.setState({connectStatus: 'Connected', disableButton: true});
    } catch (error) {
      this.handleAlert("danger", "Unable to Connect!!!");
    }

    await this.getAccount();
  };

  start = async () => {
    await this.getAccount();
    const { web3, contract, account } = this.state;
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

  loggedOut = async (loggedIn) => {
    this.setState({ loggedIn: loggedIn });
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

  render() {
    const { activeItem, color } = this.state;
    return (
      <div className="App">
        {this.state.load && <Spinner/>}
        {this.state.alert !== null ? <Alert alert={this.state.alert}/> : undefined}
        <div className="main-page" id="Background">
            <div className="home-nav">
              <Menu stackable inverted secondary size='large'>
                <Menu.Item
                  name='home'
                  color={color}
                  active={activeItem === 'home'}
                  onClick={this.handleItemClick}
                  as={Link}
                  to='/'
                />
                <Menu.Item
                  name='help'
                  color={color}
                  active={activeItem === 'help'}
                  onClick={this.handleItemClick}
                  as={Link}
                  to='/help'
                />
                {
                  this.state.loggedIn ?
                    <Menu.Item
                      position='right'
                      name='user account'
                      color={color}
                      active={activeItem === 'user account'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/user-account'
                    />
                    :
                    console.log('')
                }
                {
                  !this.state.loggedIn ?
                    <Menu.Item
                      position='right'
                      name='Login'
                      color={color}
                      active={activeItem === 'sign in'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-in'
                    />
                    :
                    <Menu.Item
                      name='sign out'
                      color='red'
                      active={activeItem === 'sign out'}
                      onClick={this.handleItemClick}
                      as={Link}
                      to='/sign-out'
                    />
                }
                <button class=" Searching btn btn-outline-success my-2 my-sm-0" type="button" onClick={this.ConnectToWallet} disabled={this.state.disableButton}>{this.state.connectStatus}</button>
              </Menu>
            </div>
            <Divider inverted />

            <Routes>
              <Route exact path='/' element={<Home />}></Route>
              <Route path='/help' element={<>Help page</>}>
              </Route>
              {/* { */}
                {/* this.state.loggedIn ? */}
                  <Route exact path='/user-account' element={<UserAccount
                    account={this.state.account}
                    username={this.state.username}
                  />}>
                    
                  </Route>
                  {/* // :
                  // <Route path='/user-account' element={<>You have been logged out</>}>
                  // </Route>
              // } */}
              {
                <Route path='/sign-in' element={
                  // this.state.loggedIn ?
                  //   this.navigator('/user-account', true)
                  //   :
                    <SignIn
                      web3={this.state.web3}
                      contract={this.state.contract}
                      account={this.state.account}
                      signedUp={this.state.signedUp}
                      userSignedIn={this.userSignedIn}
                      ConnectToWallet={this.ConnectToWallet}
                      navigator={this.navigator}
                      passwordHandle={this.passwordHandle}
                      state={this.state}
                      initialize={this.initialize}
                      setStateData={this.setStateData}
                      makeBlur={this.makeBlur}
                      alertFunc={this.handleAlert}
                    />
                }>
                </Route>
              }

              {
                this.state.loggedIn ?
                  <Route path='/sign-out' element={<><SignOut
                    loggedOut={this.loggedOut}
                  />You've been logged out
                  <br></br>
                  Thank you</>}>
                    
                  </Route>
                  :
                  <Route path='/sign-up' element={<SignUp
                    web3={this.state.web3}
                    contract={this.state.contract}
                    account={this.state.account}
                    accountCreated={this.accountCreated}
                    ConnectToWallet={this.ConnectToWallet}
                    passwordHandle={this.passwordHandle}
                    state={this.state}
                    initialize={this.initialize}
                    setStateData={this.setStateData}
                    makeBlur={this.makeBlur}
                    alertFunc={this.handleAlert}
                  />}>
                    
                  </Route>
              }
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
