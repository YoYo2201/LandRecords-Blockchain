import React, { Component } from 'react'
import '../App.css';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import AuthValidation from '../utils/AuthValidation';

export default class AllotProperty extends Component {

    state = {
        username: '',
        password: '',
        alertMessage: '',
        status: '',
        digicode: ''
    }

    componentDidMount = () => {
        this.props.initialize();
        this.props.setStateData("HomePageActive", true);
    }

    onSignIn = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
        if (this.state.username !== '') {
            let username = this.state.username.trim();

            this.props.setStateData('load', true);
            this.props.makeBlur(1);
            const myFiles = document.getElementById('myFiles').files

            const formData = new FormData()

            Object.keys(myFiles).forEach(key => {
                formData.append(key, myFiles.item(key))
            })
            const result = await fetch('http://localhost:4000/api/upload', {
                method: 'POST',
                body: formData
            }).then((res) => res.json());

            if(result.fileHash === "error")
              this.props.alertFunc("danger", "Unable to Allot Property");
            else {
              console.log("https://ipfs.io/ipfs/"+result.fileHash);
              let str = "https://ipfs.io/ipfs/"+result.fileHash;
              await this.props.contract.methods.allot_property(username, str).send({ from: this.props.account });
            }
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.setState({username: ''});
            // document.getElementById('myFiles').files = '';
        }
    }
}
    
  render() {
    if(!this.props.state.loggedIn) {
        this.props.navigator('/sign-in', true);
    }
    return (
        <div className="sign-up">
                <div className='signup-form'>
                <p style={{paddingBottom: '2px'}}>Enter Property Details</p>
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
                                    <textarea
                                        required
                                        type='text'
                                        placeholder='Property Description'
                                        value={this.state.username}
                                        autoComplete="username"
                                        onChange={e => this.setState({ username: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <input
                                        required
                                        type='file'
                                        name='Upload'
                                        id='myFiles'
                                        autoComplete="off"
                                        className='hidden'
                                        title='Upload Registry Papers'
                                    />
                                    <label for='myFiles'>Upload Registry Papers</label>
                                </Form.Field>
                                <Form.Field>
                                    <Button type='submit' primary fluid size='large' onClick={this.onSignIn}>
                                        Allot Property
                                    </Button>
                                </Form.Field>
                            </Form>
                        </Card.Content>
                    </Card>
                </div>
            </div>
    )
  }
}
