import setupIntegrationTest, {
  flushPromises
} from '../../../bootstrap/setup-integration-test'

import NewContract from '.'

let integration = {
  store: null,
  history: null,
  dispatchSpy: null,
  mountApp: null
}

beforeEach(() => {
  integration = setupIntegrationTest({ router: { location: '/' } })
})

it('New contract test', async () => {
  expect(true)
})
