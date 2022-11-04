import React, { Component } from 'react'
import spinner from './res/loading.gif'
import './Spinner.css'

export default class Spinner extends Component {
  render() {
    return (
      <div className='spin'>
        <div className='text-center' id='loading'>
            <img src={spinner} alt='Loading...' id='SpinnerId'/>
        </div>
      </div>
    )
  }
}