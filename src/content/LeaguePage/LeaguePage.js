import React from 'react';
import { InfoTile } from '../../components/BasicElements';
import { generateLeagueAPI } from '../../components/Info';
import { PageHeaderExtended } from '../../components/PageHeader';
import { getHomeName } from '../../components/PageHeader/Outline';
import { Leaderboard } from './Leaderboard';
import { TrendCurve, TrendOptions } from './Trends';
import {
  Theme,
  Grid,
  Column,
  ToastNotification,
  ContentSwitcher,
  Switch,
} from '@carbon/react';

const config = require('../../config.json');

class LeaguePage extends React.Component {
  constructor(props) {
    super(props);

    var league_id = props.location.state
      ? props.location.state.id
      : props.location.hash.replace('#', '');

    league_id = league_id ? league_id : config.default_league_id;

    this.state = {
      league_id: league_id,
      league_not_found: !Boolean(league_id),
      league_data: null,
      trend_index: 1,
      current_tab: getHomeName(),
    };
  }

  onClickTab = tabName => {
    this.setState({
      ...this.state,
      current_tab: tabName,
      [this.state.current]: false,
      [tabName]: true,
    });
  };

  componentDidMount = () => {
    if (this.state.league_id) {
      fetch(config.proxy_url + generateLeagueAPI(this.state.league_id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(res => res.json())
        .then(data => {
          this.setState({
            ...this.state,
            league_data: data,
            league_not_found: !data.standings || data.standings.length === 0,
          });
        });
    }
  };

  render() {
    return (
      <>
        <PageHeaderExtended
          currentTab={this.state.current_tab}
          onClickTab={this.onClickTab.bind(this)}
        />
        <Theme theme="g10" style={{ minHeight: '100vh' }}>
          <br />
          <br />

          <Grid className="bottom-space">
            <Column sm={4} md={8} lg={{ start: 4, end: 12 }}>
              {this.state.league_not_found && (
                <ToastNotification
                  lowContrast
                  role="status"
                  caption={'ID: ' + this.state.league_id}
                  timeout={0}
                  title="Error"
                  subtitle="League not found!"
                />
              )}

              {this.state.league_data && (
                <>
                  <Leaderboard league_data={this.state.league_data} />
                  <br />
                  <br />

                  <ContentSwitcher
                    size="sm"
                    selectedIndex={this.state.trend_index}
                    onChange={e => {
                      this.setState({ ...this.state, trend_index: e.index });
                    }}>
                    {TrendOptions.map(item => (
                      <Switch
                        key={item.name}
                        name={item.name}
                        text={item.name}
                      />
                    ))}
                  </ContentSwitcher>
                  <br />
                  <br />
                  {TrendOptions.map((item, id) => {
                    if (id === this.state.trend_index) {
                      return (
                        <TrendCurve
                          key={id}
                          name={item.name}
                          league_data={this.state.league_data}
                        />
                      );
                    }
                  })}
                  <br />
                  <br />
                </>
              )}
            </Column>

            <Column sm={4} md={8} lg={{ start: 12, end: 17 }}>
              <InfoTile props={{ title: 'News', body: '' }} />
            </Column>
          </Grid>
        </Theme>
      </>
    );
  }
}

export default LeaguePage;
