import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import img from '../img/background7.jpeg';
import '../App.css';
import Polygon from '../img/Polygon.png';
import Ethereum from '../img/Ethereum.png';
import Sale from '../img/Sale.png';
import MyHome from '../img/Home.jpg';
class Home extends Component {

    componentDidMount = () => {
        this.props.setStateData("HomePageActive", true);
    }

    render() {
        return (
            <>
            <div className='homePage'>
                <img src={MyHome} style={{borderRadius: "20px"}}></img>
                <div id='mainBox'>
                    <div id='descBox'>
                        <p id='desc1'>"Connecting Homes"</p>
                        <button type="button" className=" Searching btn btn-outline-success my-2 my-sm-0" id="SellButton" onClick={() => this.props.changeRoute('/about', false)}><p id="connectText">About</p></button>
                    </div>
                </div>
                <img src={Sale} className='imageBox'></img>
            </div>
            {/* <div className='polygon'>
                    <img src={Polygon} className='image1'></img>
            </div> */}
            </>
        );
    }
}

export default Home;
