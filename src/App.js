import { Component } from 'react';
import './app.scss';

import { Content } from '@carbon/react';
import { Route, Switch } from 'react-router-dom';

import { PageHeader } from './components/PageHeader';
import LandingPage from './content/LandingPage';
import AuctionPage from './content/AuctionPage';
import LeaguePage from './content/LeaguePage';
import ResourcePage from './content/ResourcePage';

import { Grid, Column } from '@carbon/react';

class App extends Component {
  render() {
    return (
      <Content>
        <PageHeader />
        <Grid>
          <Column lg={14} md={8} sm={4}>
            <Switch>
              <Route exact path="/" component={LandingPage} />
              <Route exact path="/auction" component={AuctionPage} />
              <Route exact path="/leaderboard" component={LeaguePage} />
              <Route exact path="/resources" component={ResourcePage} />
            </Switch>
          </Column>
          <Column lg={2} md={8} sm={4}></Column>
        </Grid>
      </Content>
    );
  }
}

export default App;
