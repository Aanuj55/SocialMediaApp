import React, { Component } from 'react';
import Web3 from 'web3';
import NavBar from './NavBar.js';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    //const networkData = SocialNetwork.networks[networkId]
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      socialNetwork: null,
      postCount: 0,
      posts: [],
      loading: true
    }
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col">
          </div>
          <div className="col">
            <h1 className="">Social Media : Soco</h1>
          </div>
          <div className="col">
          </div>
        </div>
      </div>
    );
  }
}

export default App;