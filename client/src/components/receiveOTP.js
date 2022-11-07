import React, { Component } from 'react'
import '../App.css';
import OtpInput from 'react-otp-input';

export default class receiveOTP extends Component {
    
    state = {
        otp: null
    }

    Verify = async () => {
        let input = document.getElementById("otpText").value;
        let pan = document.getElementById("panText").value;
        if(input.length < 6 || pan.length < 10) {
            this.props.alertFunc("danger", "Insufficient Length");
        }
        else {
        this.props.setStateData('load', true);
        this.props.makeBlur(1);
        let otp = await this.props.contract.methods.getOTP(this.props.account).call({ from: this.props.account });
        if(input === otp) {
            await this.props.contract.methods.sell_property(this.props.state.property[0], pan, this.props.state.property[2], this.props.state.index).send({ from: this.props.account });
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.props.alertFunc("success", "Property Sold Successfully!");
        }
        else {
            this.props.setStateData('load', false);
            this.props.makeBlur(0);
            this.props.alertFunc("danger", "Property Not Sold!!!");
        }
    }
    }

  render() {
    return (
      <div id='box1'>
        <div id='box2'>
        <p id='verifyText'>OTP Verification</p>
        <p id='smallText'>An OTP is sent to your registered email address</p>
        
        <form>
  <div class="form-group">
  <input type="text" class="form-control" id="panText" aria-describedby="emailHelp" placeholder="Enter PAN of Buyer" required minLength={10} maxLength={10}/>
    <input type="text" class="form-control" id="otpText" aria-describedby="emailHelp" placeholder="Enter OTP" required minLength={6} maxLength={6}/>
    <button type="button" class="btn btn-outline-primary" id='DetailsButton' onClick={this.Verify}>Verify and Sell</button>
  </div>
  </form>
      </div>
      </div>
    )
  }
}
