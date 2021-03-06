import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import ContractInterface from './contract_interface.jsx';
import { networks as contractNetworks, abi } from '../build/contracts/EtcRedemptionToken.json';

const Web3Connect = require('@digix/spectrum/src/helpers/web3/connect').default;
const { getNetworks } = require('@digix/spectrum/src/selectors');

class EtcRefund extends Component {
  render() {
    const loading = <p>Loading...</p>;
    const { web3Redux, networks } = this.props;
    const { address: contractAddress } = (contractNetworks || {})['61'];
    if (!contractAddress) { return loading; }
    const { web3 } = (web3Redux.networks || {})['etc'] || {};
    if (!web3) { return loading; }
    const contract = web3.eth.contract(abi).at(contractAddress);
    if (!contract) { return loading; }
    const network = networks.find(n => n.id === 'etc');
    return <ContractInterface {...{ contract, web3, network }} />;
  }
}

/*
** specs
connect to web3-redux
- check status
- redeem
*/

/*
next phase
*/

EtcRefund.propTypes = {
  web3Redux: PropTypes.object.isRequired,
  networks: PropTypes.array.isRequired,
};

export default connect(state => ({ networks: getNetworks(state) }))(Web3Connect(EtcRefund));
