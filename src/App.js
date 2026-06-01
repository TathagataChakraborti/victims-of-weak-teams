import React, { Component } from 'react';
import './app.scss';

import { Content } from '@carbon/react';
import { Route, Switch } from 'react-router-dom';

import { PageHeader } from './components/PageHeader';
import LandingPage from './content/LandingPage';
import LeaguePage from './content/LeaguePage';

import { Grid, Column } from '@carbon/react';

class App extends Component {
  render() {
    return (
      <>
        <Content>
          <PageHeader />
          <Grid>
            <Column lg={14} md={8} sm={4}>
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/auction" component={LeaguePage} />
                <Route exact path="/leaderboard" component={LeaguePage} />
              </Switch>
            </Column>
            <Column lg={2} md={8} sm={4}></Column>
          </Grid>
        </Content>
      </>
    );
  }
}

export default App;
