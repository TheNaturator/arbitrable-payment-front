import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'

import Home from '../containers/home'
import NewContract from '../containers/contract/form'
import NewEvidence from '../containers/contract/evidence-form'
import Contract from '../containers/contract'
import Profile from '../containers/profile'
import PageNotFound from '../components/page-not-found'
import { NavHeader } from '../components/nav-header'
import { KlerosFooter } from '../components/kleros-footer'

import Initializer from './initializer'
import GlobalComponents from './global-components'

import './app.css'

const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <ConnectedRouter history={history}>
        <div id="router-root">
          <Helmet>
            <title>Kleros Dapp</title>
          </Helmet>
          <NavHeader history={history} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/contracts/new" component={NewContract} />
            <Route
              exact
              path="/contracts/:contractAddress"
              component={Contract}
            />
            <Route exact path="/evidences/new" component={NewEvidence} />
            <Route component={PageNotFound} />
          </Switch>
          <KlerosFooter />
          {testElement}
          <Route exact path="*" component={GlobalComponents} />
        </div>
      </ConnectedRouter>
    </Initializer>
  </Provider>
)

App.propTypes = {
  // State
  store: PropTypes.shape({}).isRequired,

  // Router
  history: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
}

App.defaultProps = {
  testElement: null
}

export default App
