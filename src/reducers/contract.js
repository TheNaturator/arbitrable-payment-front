import PropTypes from 'prop-types'

import createReducer from '../utils/create-reducer'

// Reducer
export default createReducer({
  contract: {
    loading: false,
    data: null,
    failedLoading: false
  },
  dispute: {
    loading: false,
    data: null,
    failedLoading: false
  },
  appeal: {
    loading: false,
    data: null,
    failedLoading: false
  },
  pay: {
    loading: false,
    data: null,
    failedLoading: false
  },
  reimburse: {
    loading: false,
    data: null,
    failedLoading: false
  },
  contracts: {
    loading: false,
    data: null,
    failedLoading: false
  },
  evidence: {
    loading: false,
    data: null,
    failedLoading: false
  },
  timeout: {
    loading: false,
    data: null,
    failedLoading: false
  },
  ruling: {
    loading: false,
    data: null,
    failedLoading: false
  }
})

// Selectors
export const createContract = state => state.contract.contract.data
export const createDispute = state => state.contract.dispute.data
export const createAppeal = state => state.contract.appeal.data
export const createPay = state => state.contract.pay.data
export const createReimburse = state => state.contract.reimburse.data
export const createEvidence = state => state.contract.evidence.data
export const createTimeout = state => state.contract.timeout.data

// Shapes
export const contractShape = PropTypes.shape({
  address: PropTypes.string,
  arbitrator: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  disputeId: PropTypes.number,
  email: PropTypes.string,
  evidencePartyA: PropTypes.string,
  evidencePartyB: PropTypes.string,
  evidences: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, url: PropTypes.string })
  ),
  partyB: PropTypes.string,
  timeout: PropTypes.number,
  _id: PropTypes.string
})
