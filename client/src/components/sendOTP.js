import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import "../App.css";

export default class sendOTP extends Component {
    
    state = {
        searchActive: false,
        link1: null,
        link2: null,
        account: null,
        index: null,
        property: null,
        userAddress: null
    }

    componentDidMount = async() => {
      
    }

    onSearch = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
          var pan = document.getElementById("panInput").value;
          if(pan.length !== 10)
            this.props.alertFunc("danger", "PAN must be of 10 letters");
          else {
            this.props.setStateData('load', true);
            this.props.makeBlur(1);
            
            let userAddress = await this.props.contract.methods.getUserAddressfromPAN(pan).call({ from: this.props.account});
            if(userAddress !== '0x0000000000000000000000000000000000000000') {
            let index = await this.props.contract.methods.get_current_property_index(userAddress).call({ from: this.props.account });
            let ipfs = await this.props.contract.methods.getIPFS(userAddress).call({ from: this.props.account });
            let property = await this.props.contract.methods.get_property_details(userAddress, index).call({ from: this.props.account });
            
            this.setState({index: index, link2: ipfs, property: property[0], link1: property[2]});
            this.setState({userAddress: userAddress, searchActive: true});
            }
            else {
              this.props.alertFunc("danger", "Invalid PAN!!");
            }
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            
          }
        }
    }

    generateOTP() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    sendOTP = async () => {
      const otp = this.generateOTP();
      let url = 'http://localhost:4000/api/sendOTP';
      this.props.setStateData('load', true);
      this.props.makeBlur(1);
      const email = await this.props.contract.methods.getEmail(this.state.userAddress).call({ from: this.props.account });
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp
        }),
      }).then((res) => res.json());

      this.props.setStateData('load', false);
      this.props.makeBlur(0);
      if (result.status === "ok") {
        await this.props.contract.methods.setOTP(otp).send({ from: this.props.account });
        this.props.alertFunc('success', 'OTP Sent Successfully!!!');
      }
      else if(result.status === "error")
        this.props.alertFunc('danger', "Unable to Send OTP!!!"); 
    }

  render() {
    if(!this.props.state.govLoggedIn) {
      this.props.navigator("/admin/sign-in", true);
    }
    return (
        <>
        <form>
  <div class="form-group">
    <input type="username" class="form-control" id="panInput" aria-describedby="emailHelp" placeholder="Enter PAN" required minLength={10} maxLength={10}/>
    <button type="button" class="btn btn-outline-primary" id='DetailsButton' onClick={this.onSearch}>Get Details</button>
  </div>
  </form>
  {this.state.searchActive ?
  <>
  <div className='CardGov'>
    <div className='box'>
    <p className='titleContentGov'>Property Description</p>
      <div className='contentBoxGov'>
        <p>{this.state.property}</p>
      </div>
    </div>
    <div className='box'>
    <p className='titleContentGov'>Previous Registry Papers</p>
    <div className='contentBoxGov'>
    <p className='ipfsLink'><a href={this.state.link1} target='_black'>{this.state.link1}</a></p>
    </div>
    </div>
    <div className='box'>
    <p className='titleContentGov'>New Registry Papers</p>
    <div className='contentBoxGov'>
    <p className='ipfsLink'><a href={this.state.link2} target='_black'>{this.state.link2}</a></p>
    </div>
    </div>
  </div>
  <button type="button" class="btn btn-outline-success" id='OTPButton' onClick={this.sendOTP}>Send OTP</button>
  </>
  : undefined
  }
  </>
  )
}
}
