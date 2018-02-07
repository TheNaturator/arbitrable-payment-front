import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Blockies from 'react-blockies'
import { ClipLoader } from 'react-spinners'

import * as walletActions from '../../actions/wallet'
import { objMap } from '../../utils/functional'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../actions/contract'
import { renderIf } from '../../utils/react-redux'

import './contract.css'

class Contract extends PureComponent {
  state = {
    party: '',
    partyOther: ''
  }
  static propTypes = {
    contract: contractSelectors.contractShape.isRequired,
    fetchContract: PropTypes.func.isRequired,
    createDispute: PropTypes.func.isRequired,
    createPay: PropTypes.func.isRequired,
    fetchAccounts: PropTypes.func.isRequired,

    // Router
    match: PropTypes.shape({
      params: PropTypes.shape({ contractAddress: PropTypes.string.isRequired })
        .isRequired
    }).isRequired
  }

  componentDidMount() {
    const { match, fetchContract, contract, accounts } = this.props
    fetchContract(match.params.contractAddress)
    if (contract.data && contract.data.partyA.toLowerCase() === accounts.data[0].toLowerCase()) {
      this.setState({party: 'partyA'})
      this.setState({partyOther: 'partyB'})
    } else if (contract.data && contract.data.partyB.toLowerCase() === accounts.data[0].toLowerCase()) {
      this.setState({party: 'partyB'})
      this.setState({partyOther: 'partyA'})
    }
  }

  createDispute = () => {
    const { createDispute, match } = this.props
    createDispute(match.params.contractAddress)
  }

  createPay = () => {
    const { createPay, match } = this.props
    createPay(match.params.contractAddress)
  }

  shortAddress = address => {
    const startAddress = address.substr(0, address.length-36)
    const endAddress = address.substr(37)

    return `${startAddress}...${endAddress}`
  }

  render() {
    const { loadingContract, contract, accounts } = this.props

    return (
      <div>
        {renderIf(
          [contract.loading],
          [contract.data && contract.data.partyAFee && accounts.data && accounts.data[0]],
          [contract.failedLoading || accounts.failedLoading],
          {
            loading: <div className="loader"><ClipLoader color={'gray'}  loading={true} /></div>,
            done: contract.data && (
              <div className="Contract">
                <div className="Contract-content">
                  <div className="Contract-content-address">
                    <div><Blockies seed={contract.data.address} size={6} scale={10} bgColor="#f5f5f5" /></div>
                    <div className="Contract-content-address-address">{this.shortAddress(contract.data.address)}</div>
                  </div>
                  <div className="partyB">
                    <div className="identicon">
                      <Blockies seed={contract.data.partyA} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>
                    <div className="content">
                      {this.shortAddress(contract.data.partyA)}
                    </div>

                    <div>&nbsp;&nbsp;</div>

                    <div className="identicon">
                      <Blockies seed={contract.data.partyB} size={5} scale={4} bgColor="#f5f5f5" />
                    </div>

                    <div className="content">
                      {this.shortAddress(contract.data.partyB)}
                    </div>
                  </div>

                  <div className=" Contract-content-item Contract-content-item-mail">{contract.data.email}</div>
                  <div className="description Contract-content-item">{contract.data.description}</div>
                  {!contract.data.partyAFee && !contract.data.partyBFee ?
                    <div className="Contract-actions">
                      <div className="Contract-actions-button Contract-actions-button-left" onClick={this.createDispute}>Create dispute</div>
                      {contract.data.partyA === accounts.data[0] && <div className="Contract-actions-button Contract-actions-button-right" onClick={this.createPay}>Pay</div>}
                    </div>
                    : <div></div>
                  }
                  {!contract.data[`${this.state.party}Fee`] && contract.data[`${this.state.partyOther}Fee`] ?
                    <div>
                      <div className="Contract-waiting">
                        The other party raise a dispute. So as not to lose the dispute you must pay the fee.
                      </div>
                      <div className="Contract-actions">
                        <div className="Contract-actions-button Contract-actions-button-left" onClick={this.createDispute}>Pay the fee</div>
                      </div>
                    </div>
                    : <div className="Contract-waiting">
                        Waiting pay fee from the other party ({this.shortAddress(contract.data[this.state.partyOther])})
                      </div>
                  }
                  {contract.data.partyAFee && contract.data.partyBFee ?
                    <div className="Contract-waiting">
                      Send evidence
                    </div>
                    : <div></div>
                  }
                </div>
            </div>
            ),
            failed: contract.failedLoading && 'failedLoading contract'
        })}
      </div>
    )
  }
}

export default connect(
  state => ({
    contract: state.contract.contract,
    dispute: state.contract.dispute,
    pay: state.contract.pay,
    accounts: state.wallet.accounts
  }),
  {
    fetchContract: contractActions.fetchContract,
    createDispute: contractActions.createDispute,
    createPay: contractActions.createPay,
    fetchAccounts: walletActions.fetchAccounts
  }
)(Contract)
