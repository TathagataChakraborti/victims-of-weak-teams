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
  { key: 'move', header: '' },
  { key: 'name', header: 'Name' },
  { key: 'gw', header: 'GW' },
  { key: 'h2h', header: 'H2H' },
  { key: 'gw_points', header: 'GW Points' },
  { key: 'total_points', header: 'Total Points' },
];

// const getCurrentPosition = (id, league_data) => {};
// const getPreviousPosition = (id, league_data) => {};

const getPointsArrayFromID = (id, league_data) => {
  var points_array = [];

  league_data.matches.forEach(item => {
    if (item.started) {
      var points = null;

      if (item.league_entry_1 === id) {
        points = item.league_entry_1_points;
      } else if (item.league_entry_2 === id) {
        points = item.league_entry_2_points;
      }

      if (points)
        points_array.push({
          gameweek: item.event + 1,
          points: points,
        });
    }
  });

  return points_array;
};

const getTotalPoints = (id, league_data) =>
  getPointsArrayFromID(id, league_data).reduce(
    (total, item) => total + item.points,
    0
  );

const getGameweekPoints = (id, league_data) => {
  const points_array = getPointsArrayFromID(id, league_data);
  return points_array.length ? points_array[points_array.length - 1].points : 0;
};

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
          move: <></>,
          name: (
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
          gw: getPointsArrayFromID(row.league_entry, this.state.league_data)
            .length,
          h2h: row.total,
          gw_points: getGameweekPoints(
            row.league_entry,
            this.state.league_data
          ),
          total_points: getTotalPoints(
            row.league_entry,
            this.state.league_data
          ),
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
