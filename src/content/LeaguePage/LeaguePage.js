import React from 'react';
import {
  Theme,
  Grid,
  Column,
  DataTable,
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tag,
  ToastNotification,
} from '@carbon/react';

const config = require('../../config.json');
const leaderboardHeaders = [
  { key: 'Name', header: 'Name' },
  { key: 'H2H', header: 'H2H' },
  { key: 'GW', header: 'GW' },
  { key: 'Points', header: 'Points' },
];

const getTeamNameFromID = (id, league_data) =>
  league_data.league_entries.find(item => id === item.id).entry_name;

const getPlayerNameFromID = (id, league_data) => {
  const league_item = league_data.league_entries.find(item => id === item.id);
  return league_item.player_first_name + ' ' + league_item.player_last_name;
};

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
      league_data: null,
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
          if (data.standings) {
            this.setState({
              ...this.state,
              league_data: data,
              league_not_found: false,
            });

            console.log(data);

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
    var rows = !this.state.league_data
      ? []
      : this.state.league_data.standings.map(row => ({
          ...row,
          id: row.league_entry,
          Name: (
            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <div>
                {getTeamNameFromID(row.league_entry, this.state.league_data)}
              </div>
              <div
                style={{
                  marginTop: '5px',
                  fontSize: 'smaller',
                  color: 'gray',
                }}>
                {getPlayerNameFromID(row.league_entry, this.state.league_data)}
              </div>
            </div>
          ),
          H2H: row.total,
          GW: 'GW',
          Points: row.points_for,
        }));

    rows = rows.filter(item =>
      getTeamNameFromID(item.id, this.state.league_data)
    );

    rows.sort(function(a, b) {
      return b.Points - a.Points;
    });

    return (
      <Theme theme="g90">
        <br />
        <br />
        <Grid>
          <Column lg={6} md={4} sm={2}>
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
              <DataTable
                rows={rows}
                headers={leaderboardHeaders}
                isSortable={true}
                render={({
                  rows,
                  headers,
                  getHeaderProps,
                  getRowProps,
                  getTableProps,
                }) => (
                  <TableContainer
                    title={this.state.league_data.league.name}
                    description={
                      <>
                        <div className="table-tag">
                          <Tag
                            size="sm"
                            style={{ width: '100px' }}
                            className="team-tag">
                            League ID
                          </Tag>
                          <Tag
                            size="sm"
                            type="purple"
                            style={{ width: '75px' }}
                            className="team-tag">
                            {this.state.league_id}
                          </Tag>
                        </div>
                        <div className="table-tag">
                          <Tag
                            size="sm"
                            style={{ width: '100px' }}
                            className="team-tag">
                            Gameweek 5
                          </Tag>
                          <Tag
                            size="sm"
                            type="green"
                            style={{ width: '75px' }}
                            className="team-tag">
                            LIVE
                          </Tag>
                        </div>
                      </>
                    }>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader
                              key={header.key}
                              {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.id} {...getRowProps({ row })}>
                            {row.cells.map((cell, id) => (
                              <TableCell key={id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              />
            )}
          </Column>
          <Column lg={10} md={4} sm={2}></Column>
        </Grid>
      </Theme>
    );
  }
}

export default LeaguePage;
