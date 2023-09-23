import React from 'react';
import { CaretUp, CaretDown, Subtract } from '@carbon/icons-react';
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
  ContentSwitcher,
  Switch,
} from '@carbon/react';

import { LineChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';

const config = require('../../config.json');

const leaderboardHeaders = [
  { key: 'move', header: 'POS' },
  { key: 'name', header: 'Name' },
  { key: 'h2h', header: 'H2H' },
  { key: 'gw_points', header: 'GW' },
  { key: 'total_points', header: 'Points' },
];

const trendOptions = {
  title: 'Guns. And ships. And so the balance shifts.',
  axes: {
    bottom: {
      title: 'Gameweek',
      mapsTo: 'gameweek',
      scaleType: 'linear',
    },
    left: {
      mapsTo: 'points',
      title: 'Points',
      scaleType: 'linear',
    },
  },
  curve: 'curveLinear',
  height: '400px',
};

const monoMalinyo = id => (id === 343164 ? 10 : 0);

const getPointsArrayFromID = (id, league_data) => {
  var points_array = [
    {
      gameweek: 0,
      points: monoMalinyo(id),
    },
  ];

  league_data.matches.forEach(match => {
    if (match.started) {
      var points = null;

      if (match.league_entry_1 === id) {
        points = match.league_entry_1_points;
      } else if (match.league_entry_2 === id) {
        points = match.league_entry_2_points;
      }

      if (points !== null)
        points_array.push({
          gameweek: match.event,
          points: points,
        });
    }
  });

  return points_array;
};

const getTotalPoints = (id, league_data, gameweek) => {
  var all_points_array = getPointsArrayFromID(id, league_data);
  var gw =
    typeof gameweek === 'undefined' ? getCurrentGW(league_data) : gameweek;

  all_points_array = all_points_array.filter(item => item.gameweek <= gw);

  return all_points_array.reduce((total, item) => total + item.points, 0);
};

const getGameweekPoints = (id, league_data, gameweek) => {
  const points_array = getPointsArrayFromID(id, league_data);
  const gw =
    typeof gameweek === 'undefined' ? getCurrentGW(league_data) : gameweek;

  const points = points_array.find(item => item.gameweek === gw).points;

  return points ? points : 0;
};

const getTeamNameFromID = (id, league_data) =>
  league_data.league_entries.find(item => id === item.id).entry_name;

const getPlayerNameFromID = (id, league_data) => {
  const league_item = league_data.league_entries.find(item => id === item.id);
  return league_item.player_first_name + ' ' + league_item.player_last_name;
};

const getCurrentGW = league_data => {
  var cache = league_data.matches.findLast(match => match.started);
  return cache ? cache.event : 1;
};

const getCurrentGWStatus = league_data => {
  var cache = league_data.matches.findLast(match => match.started);
  return cache && cache.finished;
};

const getMoveObject = (id, league_data) => {
  const new_rank = getPosition(id, league_data, getCurrentGW(league_data));
  const old_rank = getPosition(id, league_data, getCurrentGW(league_data) - 1);

  if (new_rank < old_rank) {
    return (
      <>
        <CaretUp className="move-object" style={{ color: '#00ff00' }} />{' '}
        {new_rank}
      </>
    );
  } else if (new_rank > old_rank) {
    return (
      <>
        <CaretDown className="move-object" style={{ color: '#ff0000' }} />{' '}
        {new_rank}
      </>
    );
  } else {
    return (
      <>
        <Subtract className="move-object" style={{ color: '#636363' }} />{' '}
        {new_rank}
      </>
    );
  }
};

const generateTrendDataAverage = league_data => {
  var data = [];

  league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(entry.id, league_data)
        .filter(item => item.gameweek)
        .map((item, id) => {
          return {
            group: entry.entry_name,
            gameweek: id + 1,
            points: getTotalPoints(entry.id, league_data, id + 1) / (id + 1),
          };
        });

      data = data.concat(all_points_array);
    });

  return data;
};

const generateTrendData = league_data => {
  var data = [];

  league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(entry.id, league_data).map(
        (item, id) => {
          return {
            group: entry.entry_name,
            gameweek: id,
            points: getTotalPoints(entry.id, league_data, id),
          };
        }
      );

      data = data.concat(all_points_array);
    });

  return data;
};

const getPosition = (id, league_data, gameweek) => {
  const all_players_points_array = league_data.league_entries
    .filter(entry => entry.entry_name)
    .map(entry => {
      return {
        id: entry.id,
        gw_points: getGameweekPoints(entry.id, league_data, gameweek),
        total_points: getTotalPoints(entry.id, league_data, gameweek),
      };
    });

  all_players_points_array.sort(function(a, b) {
    return b.total_points !== a.total_points
      ? b.total_points - a.total_points
      : b.gw_points - a.gw_points;
  });

  const position =
    all_players_points_array.findIndex(item => item.id === id) + 1;
  return position;
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
      trend_index: 0,
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
          if (data.standings && data.standings.length >= 1) {
            this.setState(
              {
                ...this.state,
                league_data: data,
                league_not_found: false,
              },
              () => {
                const path_to_data = './data/[ID].json'.replace(
                  '[ID]',
                  this.state.league_id
                );
                import(`${path_to_data}`).then(({ default: data }) => {
                  const average_data = generateTrendDataAverage(
                    this.state.league_data
                  ).map(item => item.points);

                  var trend_options_cum = JSON.parse(
                    JSON.stringify(trendOptions)
                  );
                  trend_options_cum.axes.bottom.domain = [
                    0,
                    this.state.league_data.standings[0].matches_played,
                  ];
                  trend_options_cum.axes.height =
                    (Object.keys(data['player_map']).length * 80).toString() +
                    'px';

                  var trend_options_avg = JSON.parse(
                    JSON.stringify(trend_options_cum)
                  );
                  trend_options_avg.axes.bottom.domain = [
                    1,
                    getCurrentGW(this.state.league_data),
                  ];
                  trend_options_avg.axes.left.domain = [
                    Math.min(...average_data),
                    Math.max(...average_data),
                  ];

                  this.setState({
                    ...trendOptions,
                    trend_options_cumulative: trend_options_cum,
                    trend_options_average: trend_options_avg,
                  });
                });
              }
            );

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
      : this.state.league_data.standings
          .filter(item =>
            getTeamNameFromID(item.league_entry, this.state.league_data)
          )
          .map(row => ({
            ...row,
            id: row.league_entry.toString(),
            move: getMoveObject(row.league_entry, this.state.league_data),
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
                  {getPlayerNameFromID(
                    row.league_entry,
                    this.state.league_data
                  )}
                </div>
              </div>
            ),
            h2h: row.total,
            position: getPosition(row.league_entry, this.state.league_data),
            gw_points: getGameweekPoints(
              row.league_entry,
              this.state.league_data
            ),
            total_points: getTotalPoints(
              row.league_entry,
              this.state.league_data
            ),
          }));

    rows.sort(function(a, b) {
      return a.position - b.position;
    });

    return (
      <Theme theme="g10" style={{ minHeight: '100vh' }}>
        <br />
        <br />

        <Grid>
          <Column lg={6} md={8} sm={4} className="bottom-space">
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
                          <Tag className="team-tag">League ID</Tag>
                          <Tag type="purple" className="team-tag">
                            {this.state.league_id}
                          </Tag>
                        </div>
                        <div className="table-tag">
                          <Tag className="team-tag">
                            Gameweek {getCurrentGW(this.state.league_data)}
                          </Tag>
                          <Tag
                            type={
                              getCurrentGWStatus(this.state.league_data)
                                ? 'green'
                                : 'magenta'
                            }
                            className="team-tag">
                            {getCurrentGWStatus(this.state.league_data)
                              ? 'DONE'
                              : 'LIVE'}
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
          <Column lg={10} md={8} sm={4} className="bottom-space">
            <Grid>
              <Column lg={4} md={4} sm={2}>
                <ContentSwitcher
                  size="sm"
                  onChange={e => {
                    this.setState({ ...this.state, trend_index: e.index });
                  }}>
                  <Switch name="cumulative" text="Cumulative" />
                  <Switch name="average" text="Average" />
                </ContentSwitcher>
                <br />
                <br />
              </Column>
            </Grid>
            {this.state.league_data && this.state.trend_index === 0 && (
              <LineChart
                data={generateTrendData(this.state.league_data)}
                options={
                  this.state.trend_options_cumulative || trendOptions
                }></LineChart>
            )}
            {this.state.league_data && this.state.trend_index === 1 && (
              <LineChart
                data={generateTrendDataAverage(this.state.league_data)}
                options={
                  this.state.trend_options_average || trendOptions
                }></LineChart>
            )}
          </Column>
        </Grid>
      </Theme>
    );
  }
}

export default LeaguePage;
