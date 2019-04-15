import React, { Component } from 'react';
import logo from './logo.svg';
import myImage from './foo.jpg';
import './App.css';
import {Tesseract} from "tesseract.ts";

class App extends Component {
  componentDidMount(){
    console.log("App componentDidMount")
      Tesseract
          .recognize(myImage)
          .progress(console.log)
          .then((res) => {
              console.log(res);
          })
          .catch(console.error);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
