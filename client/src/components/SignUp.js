import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthenticationHash from '../utils/AuthenticationHash';
import "../App.css";
import SpinnerVerify from '../SpinnerVerify';
import Property from '../img/Property.jpg';

class SignUp extends Component {
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
        verifyClass: '',
        email: ''
    }

    componentDidMount = () => {
        this.props.initialize();
        let doc = document.getElementsByClassName("content");
        doc[0].style.paddingRight = "1.2em";
        let pan = document.getElementById("panStyle").style;
        pan.width = "109%";
        this.props.setStateData("HomePageActive", false);
    }

    Verify = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if(this.state.pan.length == 10) {
        this.setState({spinnerActive: true});
        let panStatus = await this.props.contract.methods.checkPANDetails(this.state.pan).call({ from: this.props.account });
        if(panStatus === "Exists") {
            this.setState({
                alertMessage: "PAN is already linked with an Account!!!",
                status: 'failed'
            });
            setTimeout(() => {
                this.setState({
                  alertMessage: null,
                  status: ''
                })
              }, 1800);
            this.setState({spinnerActive: false})
            this.setState({verify: false})
            this.props.setStateData('disable', true);
            this.setState({disable: true});
        }
        else {
            let pan = document.getElementById("panStyle").style;
            pan.width = "106.3%";
            this.setState({
                alertMessage: "PAN Verification Successful",
                status: 'success'
            });
            setTimeout(() => {
                this.setState({
                  alertMessage: null,
                  status: ''
                })
              }, 1800);
            this.setState({spinnerActive: false})
            this.setState({verify: true})
            this.setState({disable: false});
        }
    }
    else {
        this.setState({
            alertMessage: "PAN must of 10 letters!",
            status: 'failed'
        });
        setTimeout(() => {
            this.setState({
              alertMessage: null,
              status: ''
            })
          }, 1800);
    }
}
    }

    Edit = () => {
        this.setState({disable: true, verify: false})
        let pan = document.getElementById("panStyle").style;
        pan.width = "109%";
    }

    onSignUp = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if (this.state.username !== '' && this.state.password !== '' && this.state.digicode !== '') {
            let username = this.state.username.trim();
            let password = this.state.password.trim();
            let digicode = this.state.digicode.trim();
            let pan = this.state.pan.trim();
            let email = this.state.email.trim();

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
                let userAddress = await this.props.contract.methods.getUserAddress()
                    .call({ from: this.props.account });
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
                    let hash = await AuthenticationHash(username, this.props.account, password, digicode, this.props.web3);
                    await this.props.contract.methods.register(hash, pan, email).send({ from: this.props.account });

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
                    this.Edit();
                    this.props.accountCreated(this.state.signedUp);
                    this.props.navigator('/sign-in', true);
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
                <p style={{paddingBottom: '2px'}}>Create an account</p>
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
                                <div className='field' id="panStyle" style={{width: '109%'}}>
                                <div id='panContain'>
                                    <input
                                        required
                                        type='text'
                                        placeholder='PAN Number'
                                        value={this.state.pan}
                                        autoComplete="off"
                                        onChange={e => this.setState({ pan: e.target.value })}
                                        disabled={!this.state.disable}
                                        minLength={10}
                                        id="pan"
                                    />
                                    <label for="pan" className='labelPassword'>
                                        {this.state.spinnerActive === true ? <SpinnerVerify/> : undefined}
                                        {this.state.spinnerActive === true ? undefined : this.state.verify === true ? <button type="button" className="verify-forgot" onClick={this.Edit}>Edit</button> : <button type="button" className="verify-forgot" onClick={this.Verify}>Verify</button>}
                                    </label>
                                    </div>
                                    </div>
                                
                                <Form.Field>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Username'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                        disabled={this.state.disable}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='email'
                                        placeholder='Enter Email'
                                        value={this.state.email}
                                        autoComplete="off"
                                        onChange={e => this.setState({ email: e.target.value })}
                                        disabled={this.state.disable}
                                    />
                                </Form.Field>
                                <Form.Field>
                                <label for="password" className='labelPassword'>
                    <i className="password material-icons"></i>
                    <button
                    type="button"
                    id="show-password"
                    onClick={() => this.props.passwordHandle('password', 1)}
                    disabled={this.state.disable}
                  >
                    <i className="showPassword material-icons">{this.props.state.password}</i>
                  </button>
                  </label>
                                    <input
                                        required
                                        type='password'
                                        placeholder='Password'
                                        id='password'
                                        value={this.state.password}
                                        autoComplete="new-password"
                                        onChange={e => this.setState({ password: e.target.value })}
                                        disabled={this.state.disable}
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
                    disabled={this.state.disable}
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
                                        disabled={this.state.disable}
                                        minLength={8}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignUp} disabled={this.state.disable}>
                                        Create account
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                    <div className="signin-onUp">
                        Already have an account? <Link to='/sign-in'>Sign in</Link>
                    </div>
                </div>
                {/* <img src={Property} id='property'></img> */}
            </div>
        );
    }
}

export default SignUp
