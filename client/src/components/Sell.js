import React, { Component } from 'react';
import { Form, Button, Card, Message } from 'semantic-ui-react';
import "../App.css";

export default class Sell extends Component {

    constructor(props) {
      super(props);
      this.state = {
        searchActive: false,
        ipfsHash: '',
        web3: null,
        buffer: null,
        account: null
      }
      this.onSubmit = this.onSubmit.bind(this);
    }

    onSearch = async () => {
        if(this.props.state.connectStatus === 'Connect')
            this.props.alertFunc("danger", "Connect your Account First!!")
        else {
            this.setState({searchActive: true})
        }
    }

    buttonClick = (index, property) => {
      this.props.setStateData("index", index);
      this.props.setStateData("property", property);
      this.props.navigator("/sell/1", false);
    }

    componentDidMount = async() => {
      this.props.initialize();
      this.props.setStateData("HomePageActive", true);
      try {
      var indexArr = await this.props.contract.methods.get_all_property_index(this.props.account).call({ from: this.props.account });
      var propertyDetails = await this.props.contract.methods.get_all_property_details(this.props.account).call({ from: this.props.account });
      var propertyCount = propertyDetails.length;
      console.log(propertyCount);
      for(let i=0;i<propertyCount;i++) {
        let cardElement = document.getElementById('CardID');
        let boxElement = document.createElement('button');
        let contentElement = document.createElement('div');
        let titleElement = document.createElement('p');
        let paraElement = document.createElement('p');

        boxElement.className = 'box';
        titleElement.className = 'titleContent';
        contentElement.className = 'contentBox';

        boxElement.onclick = () => {this.buttonClick(indexArr[i], propertyDetails[i])};


        titleElement.innerText = "Property Description";
        paraElement.innerText = propertyDetails[i][0];

        contentElement.append(paraElement);
        titleElement.append(contentElement);
        boxElement.append(titleElement);
        cardElement.append(boxElement);

      }
    }
    catch(error) {
      ;
    }
  }

    onSubmit = async (event) => {
      event.preventDefault();
      
    }

  render() {
    if(!this.props.state.loggedIn) {
      this.props.navigator('/sign-in', true);
    }
    return (
        <>
        <div className='Cards' id='CardID'>
    {/* <div className='box'>
    <p className='titleContent'>Property Description</p>
      <div className='contentBox'>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Porta lorem mollis aliquam ut porttitor leo a. Ullamcorper malesuada proin libero nunc consequat interdum. Feugiat in fermentum posuere urna nec tincidunt praesent semper. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Porta nibh venenatis cras sed felis eget velit aliquet sagittis. Suspendisse ultrices gravida dictum fusce ut placerat orci nulla pellentesque. </p>
      </div>
    </div>
    <div className='box'>
    <p className='titleContent'>Previous Registry Papers</p>
    <div className='contentBox'>
    <p className='ipfsLink'><a href={this.state.link1} target='_black'>{this.state.link1}</a></p>
    </div>
    </div>
    <div className='box'>
    <p className='titleContent'>New Registry Papers</p>
    <div className='contentBox'>
    <p className='ipfsLink'><a href={this.state.link2} target='_black'>{this.state.link2}</a></p>
    </div>
    </div> */}
  </div>
  </>
  )
}
}
