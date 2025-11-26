import React, { Component } from 'react';
import './app.scss';

import { Content } from '@carbon/react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './content/LandingPage';
import LeaguePage from './content/LeaguePage';

class App extends Component {
  render() {
    return (
      <>
        <Content>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/leaderboard" component={LeaguePage} />
          </Switch>
        </Content>
      </>
    );
  }
}

export default App;
