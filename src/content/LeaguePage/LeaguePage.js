import React from 'react';
// import { Trophy } from '@carbon/icons-react';
import { Theme, Grid, Column, ToastNotification } from '@carbon/react';

const config = require('../../config.json');

class LeaguePage extends React.Component {
  constructor(props) {
    super(props);

    var league_id = props.location.state
      ? props.location.state.id
      : props.location.hash.replace('#', '');
    league_id = league_id ? league_id : config['default_league_id'];

    this.state = {
      league_id: league_id,
      league_not_found: !Boolean(league_id),
      new_data: null,
    };
  }

  componentDidMount = () => {
    if (this.state.league_id) {
      const url = config['league_api'].replace(
        'LEAGUE_ID',
        this.state.league_id
      );
      fetch(config['proxy_url'] + url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log(666, data);
          if (data.standings) {
            // const path_to_data = './data/[ID].json'.replace("[ID]", this.state.league_id);
            // import(`${path_to_data}`).then(({default: data}) => console.log(1, data));
            // fetch(config['proxy_url'] + config['static_api'], {
            //   method: 'GET',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Access-Control-Allow-Origin': '*',
            //   },
            // })
            //   .then(res => res.json())
            //   .then(data => {
            //     this.setState({
            //       ...this.state,
            //       new_data: data,
            //     });
            //   });
          } else {
            this.setState({
              ...this.state,
              league_not_found: true,
            });
          }
        });
    }
  };

  render() {
    return (
      <Theme theme="g90">
        <br />
        <br />
        <Grid>
          <Column lg={10} md={4} sm={2}>
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
          </Column>
          <Column lg={6} md={4} sm={2}></Column>
        </Grid>
      </Theme>
    );
  }
}

export default LeaguePage;
