import React, { PropTypes, Component } from 'react';
import { Header, Segment, Table, Message, Icon, Progress } from 'semantic-ui-react';

const Advanced = require('@digix/spectrum/src/components/common/advanced').default;

export default class ContractStatus extends Component {
  renderStatus() {
    const { data: { active, activationBlock, blockNumber } } = this.props;
    if (active) {
      return (
        <Message
          positive
          header="Contract is now active"
          content="Redemptions and transfers are allowed"
          icon="calendar check"
        />
      );
    }
    if (activationBlock > 0) {
      const blocksToGo = activationBlock.sub(blockNumber);
      const estimatedTime = blocksToGo.mul(4).div(60).toFormat(0);
      return (
        <Message
          warning
          header={`Contract activates on block ${activationBlock.toFormat(0)}`}
          content={`You will be able to redeem in ${blocksToGo} blocks (about ${estimatedTime} minutes)`}
          icon="calendar times"
        />
      );
    }
    return (
      <Message
        negative
        header="Activation block not set"
        content="Contract is in maintenance mode"
        icon="wrench"
      />
    );
  }
  render() {
    const { data, contract } = this.props;
    return (
      <div>
        <Header>
          Conrract Info
          <Header.Subheader>{contract.address}</Header.Subheader>
        </Header>
        <Segment>
          {this.renderStatus()}
          <Progress progress percent={data.etcPercent} color="green">
            {data.etcRemaining} ETC available ({data.etcRedeemed} claimed)
          </Progress>
          <Progress progress percent={data.topUpPercent} color="orange">
            {data.etcBalance} ETC contract balance
          </Progress>
          <Progress progress percent={data.multiSigPercent} color="blue">
            {data.multiSigEtc} ETC cold storage balance
          </Progress>
          {/* TODO calculator input box */}

          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Activation Block</Table.Cell>
                <Table.Cell>{data.activationBlock.toFormat(0)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Total DGDR created</Table.Cell>
                <Table.Cell>{data.totalTokenExisted.shift(-9).toNumber()}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>ETC balance</Table.Cell>
                <Table.Cell>{data.weiBalance.shift(-18).toNumber()}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>ETC to be distributed (incl. redeemed)</Table.Cell>
                <Table.Cell>{data.totalTokenExisted.mul(data.rate).shift(-18).toFormat(2)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>DGDR redeemed</Table.Cell>
                <Table.Cell>{data.totalTokenRedeemed.shift(-9).toNumber()}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>ETC funded (balance + redeeemed)</Table.Cell>
                <Table.Cell>{data.totalWeiRedeemed.add(data.weiBalance).shift(-18).toFormat(2)}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Exchange Rate</Table.Cell>
                <Table.Cell>1 DGDR = {data.rate.shift(-9).toNumber()} ETC</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Exchange Rate (wei per DGDR / 1e9)</Table.Cell>
                <Table.Cell>{data.rate.toFormat(0)}</Table.Cell>
              </Table.Row>
            </Table.Body>
            {/* TODO Cold Storage */}
          </Table>
          <Advanced title="JSON">
            <pre><code>
              {JSON.stringify(data, null, 2)}
            </code></pre>
          </Advanced>
        </Segment>
      </div>
    );
  }
}

ContractStatus.propTypes = {
  contract: PropTypes.object.isRequired,
  web3: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};
