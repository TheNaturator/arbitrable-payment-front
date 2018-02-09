import unit from 'ethjs-unit'
import { takeLatest, call, put, select } from 'redux-saga/effects'
import { push } from 'react-router-redux'

import kleros, { eth } from '../bootstrap/dapp-api'
import * as contractActions from '../actions/contract'
import * as contractSelectors from '../reducers/contract'
import { receiveAction, errorAction } from '../utils/actions'
import { ETH_NO_ACCOUNTS } from '../constants/errors'

/**
 * Creates a new contract.
 * @param {object} { payload: contract } - The contract to create.
 */
function* createContract({type, payload: { contract }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let newContract = null

  try {
    newContract = yield call(
      kleros.arbitrableContract.deployContract,
      accounts[0].toLowerCase(),
      unit.toWei(contract.payment, 'ether'),
      contract.description,
      process.env.REACT_APP_ARBITRATOR_ADDRESS,
      process.env.REACT_APP_ARBITRATOR_TIMEOUT,
      contract.partyB.toLowerCase(),
      process.env.REACT_APP_ARBITRATOR_EXTRADATA,
      contract.email,
      contract.description
    )
  } catch (err) {
    console.log(err)
  }

  yield put(contractActions.receiveContract(newContract))
}

/**
 * Fetches contracts for the current user and puts them in the store.
 */
function* fetchContracts() {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let contracts = []

  contracts = yield call(
    kleros.arbitrator.getContractsForUser,
    accounts[0].toLowerCase()
  )

  yield put(contractActions.receiveContracts(contracts.reverse()))
}

/**
 * Fetches contract details.
 * @param {object} { payload: contractAddress } - The address of the contract to fetch details for.
 */
function* fetchContract({ payload: { contractAddress } }) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let contract = null

  try {
    contract = yield call(
      kleros.arbitrableContract.getData,
      contractAddress,
      accounts[0].toLowerCase()
    )
  } catch (err) {
    console.log(err)
  }

  yield put(contractActions.receiveContract(contract))
}

/**
 * Pay the party B. To be called when the good is delivered or the service rendered.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* createPay({type, payload: { contractAddress }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let payTx = null

  try {
    const arbitrableContract = yield call(
      kleros.arbitrableContract._ArbitrableContract.load,
      contractAddress
    )

    const payTx = yield call(arbitrableContract.pay, {from: accounts[0]})

    // notification pay in waiting

  } catch (err) {
    console.log(err)
  }

  // notification pay done

  yield put(contractActions.receivePay(payTx))
}

/**
 * Reimburse party A. To be called if the good or service can't be fully provided.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* reimburse({type, payload: { contractAddress }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let reimburseTx = null

  try {
    const arbitrableContract = yield call(
      kleros.arbitrableContract._ArbitrableContract.load,
      contractAddress,
      // amountReimbursed
    )

    const reimburseTx = yield call(
      arbitrableContract.reimburse,
      {from: accounts[0]}
    )

    // notification reimburse in waiting

  } catch (err) {
    console.log(err)
  }

  // notification reimburse done

  yield put(contractActions.receiveReimburse(reimburseTx))
}

/**
 * Raises dispute.
 * @param {object} { payload: contractAddress } - The address of the contract.
 */
function* createDispute({type, payload: { contractAddress }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  let contract, disputeTx = null

  try {
    contract = yield call(
      kleros.arbitrableContract.getData,
      contractAddress
    )

    let fee
    if (contract.partyA === accounts[0])
      fee = contract.partyAFee
    if (contract.partyB === accounts[0])
      fee = contract.partyBFee

    const court = yield call(
      kleros.klerosPOC.load,
      process.env.REACT_APP_ARBITRATOR_ADDRESS
    )

    const arbitrationCost = yield call(
      court.arbitrationCost,
      contract.arbitratorExtraData
    )

    const cost = unit.fromWei(arbitrationCost.toNumber() - fee, 'ether')

    if (accounts[0] === contract.partyA) {
      disputeTx = yield call(
        kleros.disputes.raiseDisputePartyA,
        accounts[0],
        contractAddress,
        cost
      )
    } else if (accounts[0] === contract.partyB) {
      disputeTx = yield call(
        kleros.disputes.raiseDisputePartyB,
        accounts[0],
        contractAddress,
        cost
      )
    }
  } catch (err) {
    console.log(err)
  }

  yield put(push('/'))

  // add notification

  yield put(contractActions.receiveDispute(disputeTx))
}

/**
 * Send evidence
 * @param {object} { payload: evidence } - Evidence.
 */
function* createEvidence({type, payload: { evidence }}) {
  const accounts = yield call(eth.accounts)
  if (!accounts[0]) throw new Error(ETH_NO_ACCOUNTS)

  yield put(push('/'))

  let evidenceTx = null

  try {
    evidenceTx = yield call(
      kleros.arbitrableContract.submitEvidence,
      accounts[0],
      evidence.addressContract,
      evidence.name,
      evidence.description,
      evidence.url
    )

    // notification send evidence in waiting

  } catch (err) {
    console.log(err)
  }

  // notification evidence sent

  yield put(contractActions.receiveEvidence(evidenceTx))
}

/**
 * The root of the wallet saga.
 * @export default walletSaga
 */
export default function* walletSaga() {
  yield takeLatest(contractActions.CREATE_CONTRACT, createContract),
  yield takeLatest(contractActions.FETCH_CONTRACTS, fetchContracts)
  yield takeLatest(contractActions.FETCH_CONTRACT, fetchContract),
  yield takeLatest(contractActions.CREATE_DISPUTE, createDispute),
  yield takeLatest(contractActions.CREATE_PAY, createPay),
  yield takeLatest(contractActions.CREATE_REIMBURSE, reimburse),
  yield takeLatest(contractActions.CREATE_EVIDENCE, createEvidence)
}
