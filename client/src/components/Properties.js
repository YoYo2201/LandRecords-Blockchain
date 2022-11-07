import React, { Component } from 'react'

export default class Properties extends Component {

  componentDidMount = () => {
    this.props.initialize();
    this.props.setStateData("HomePageActive", true);
  }

  render() {
    if(!this.props.state.loggedIn) {
      console.log("heyy")
      this.props.navigator('/sign-in', true);
    }
    return (
      <div>
        
      </div>
    )
  }
}
