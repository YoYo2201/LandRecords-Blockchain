import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";
import SpinnerVerify from '../SpinnerVerify';
import Property from '../img/India.png';

class AdminSignUp extends Component {
    state = {
        username: '',
        password: '',
        digicode: '',
        alertMessage: '',
        pan: '',
        status: '',
        signedUp: false,
        verify: false,
        spinnerActive: false,
        disable: true,
        verifyClass: ''
    }

    componentDidMount = () => {
        this.props.initialize();
        let doc = document.getElementsByClassName("content");
        doc[0].style.paddingRight = "1.2em";
        this.props.setStateData("HomePageActive", true);
    }

    onSignUp = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();

            //===
            if (password.length < 8) {
                this.setState({
                    alertMessage: "Password must be of at least 8 characters",
                    status: 'failed',
                    password: '',
                    digicode: '',
                });
                setTimeout(() => {
                    this.setState({
                      alertMessage: null,
                      status: ''
                    })
                  }, 1800);
                return;
            } else {

            } if (digicode.length !== 6) {
                this.setState({
                    alertMessage: "DigiCode must be of 6 digits",
                    status: 'failed',
                    digicode: ''
                });
                setTimeout(() => {
                    this.setState({
                      alertMessage: null,
                      status: ''
                    })
                  }, 1800);
                return
            } else {
                this.props.setStateData('load', true);
                this.props.setStateData('disable', true);
                this.props.makeBlur(1);
                let userAddress = await this.props.contract.methods.getGovAddress()
                    .call({ from: this.props.account });
                console.log(userAddress)
                if (userAddress !== '0x0000000000000000000000000000000000000000') {
                    this.setState({
                        alertMessage: 'Account already Exists!',
                        status: 'failed',
                        username: '',
                        password: '',
                        digicode: '',
                    });
                    setTimeout(() => {
                        this.setState({
                          alertMessage: null,
                          status: ''
                        })
                      }, 1800);
                    this.props.setStateData('load', false);
                    this.props.makeBlur(0);
                    this.props.setStateData('disable', false);
                    return;
                } else {
                    if((this.props.account !== "0x9C459e648558e3E94432Ea1cE9ce9859F39290B7") && (this.props.account !== "0x9C459e648558e3E94432Ea1cE9ce9859F39290B7".toLowerCase())) {
                        this.props.setStateData('load', false);
                        this.props.makeBlur(0);
                        this.props.setStateData('disable', false);
                        this.setState({
                            alertMessage: 'Invalid Wallet Address!!!',
                            status: 'failed',
                            username: '',
                            password: '',
                            digicode: '',
                        });
                        setTimeout(() => {
                            this.setState({
                              alertMessage: null,
                              status: ''
                            })
                          }, 1800);
                        return;
                    }
                    let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);
                    await this.props.contract.methods.registerGov(hash).send({ from: this.props.account });

                    this.setState({
                        username: '',
                        password: '',
                        digicode: '',
                        status: 'success',
                        alertMessage: "Sign Up successful",
                        signedUp: true,
                        pan: ''
                    });
                    setTimeout(() => {
                        this.setState({
                          alertMessage: null,
                          status: ''
                        })
                      }, 1800);
                    this.props.setStateData('load', false);
                    this.props.makeBlur(0);
                    this.props.setStateData('disable', false);
                    this.props.navigator('/admin/sign-in', true);
                    return;
                }
            }
        }
    }
    }

    render() {
        return (
<div className="sign-up">
                <div>
                <img src={Property} id='property'></img></div>
                <div className='signup-form'>
                <p style={{paddingBottom: '2px'}}>Admin Sign Up</p>
                    <Card fluid centered>
                        <Card.Content>
                            <Form size='large'>
                                {
                                    this.state.alertMessage !== '' && this.state.status === 'failed' ?
                                        <Message negative>
                                            {this.state.alertMessage}
                                        </Message> :
                                        this.state.alertMessage !== '' && this.state.status === 'success' ?
                                            <Message positive>
                                                {this.state.alertMessage}
                                            </Message> :
                                            console.log('')
                                }
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                <label for="password" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('password', 1)}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='Password'
                                        value={this.state.password}
                                        id='password'
                                        autoComplete="current-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                        minLength={8}
                                    />
                                </Form.Field>
                                <Form.Field>
                                <label for="code" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('code', 2)}
                  >
                    <i className="showPassword material-icons">{this.props.state.code}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='6 Digit Code'
                                        value={this.state.digicode}
                                        id='code'
                                        autoComplete="digicode"
                                        onChange={e => this.setState({ digicode: e.target.value })}
                                        length={8}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp} disabled={this.props.state.disable}>
                                        Sign up
                                    </Button>
                                </Form.Field>

                            </Form>
                        </Card.Content>
                    </Card>
                            <div className="signin-onUp">
                                Already have an account? <Link to='/admin/sign-in'>Sign In</Link>
                            </div>
                </div>
            </div>
        );
    }
}

export default AdminSignUp
