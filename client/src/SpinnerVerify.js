import React, { Component } from 'react'
import spinner from './res/verify-loading.gif'
import './SpinnerVerify.css'

export default class SpinnerVerify extends Component {
  render() {
    return (
      <div>
            <img src={spinner} alt='Loading...' id='imageID'/>
            </div>
    )
  }
}