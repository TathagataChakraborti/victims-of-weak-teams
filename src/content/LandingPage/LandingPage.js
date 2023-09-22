import React from 'react';
import GitHubButton from 'react-github-btn';

import { Link as NewLink } from 'react-router-dom';
import { Bee, Soccer, HelpFilled, Add } from '@carbon/icons-react';
import { TeamTile } from '../../components/BasicElements';
import { LINKS } from './Links';
import {
  initializeTeam,
  isAuctionDone,
  getPlayerPosition,
  getPlayerTeam,
  computeRemainingMoney,
  generateUrl,
} from '../../components/Info';

import {
  DataTable,
  Theme,
  Grid,
  Column,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
  TableSelectRow,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  Tile,
  TextInput,
  Button,
  Pagination,
  Dropdown,
  NumberInput,
  InlineNotification,
  ClickableTile,
} from '@carbon/react';

const config = require('../../config.json');
const infoTableHeaders = [
  { key: 'dr', header: 'DR' },
  { key: 'name', header: 'Name' },
  { key: 'team', header: 'Team' },
  { key: 'pos', header: 'POS' },
  { key: 'cr', header: 'CR' },
  { key: 'ir', header: 'IR' },
  { key: 'tr', header: 'TR' },
];

const invalid_league_id_msg = 'Please provide valid league ID';
const makePlayerName = player_object =>
  player_object.first_name + ' ' + player_object.second_name;

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league_id: '',
      player_search: '',
      static_data: null,
      player_list: [],
      current_type: '',
      currentPageSize: 10,
      firstRowIndex: 0,
      selectedTeam: null,
      current_price: config['minimum_price'],
      player_map: {},
      error_msg: null,
      add_error_msg: null,
    };
  }

  componentDidMount = () => {
    fetch(config['proxy_url'] + config['static_api'], {
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
          static_data: data,
          player_list: data.elements,
        });
      });
  };

  filterPlayers(filter_by) {
    var current_list =
      filter_by.type === this.state.current_type
        ? this.state.static_data.elements
        : this.state.player_list;

    current_list = current_list.filter(
      item => filter_by.value === 0 || item[filter_by.type] === filter_by.value
    );

    this.setState({
      ...this.state,
      player_list: current_list,
      current_type: filter_by.type,
    });
  }

  fetchLeagueData = () => {
    if (!this.state.league_id) {
      this.setState({
        ...this.state,
        error_msg: invalid_league_id_msg,
      });

      return null;
    }

    const url = config['league_api'].replace('LEAGUE_ID', this.state.league_id);
    fetch(config['proxy_url'] + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(res => res.json())
      .then(data => {
        var player_map = {};
        data.league_entries
          .filter(item => item.entry_name)
          .forEach(item => {
            player_map[item.entry_name] = initializeTeam();
          });

        this.setState({
          ...this.state,
          league_data: data,
          player_map: player_map,
        });
      });
  };

  addPlayer = selectedItem => {
    const price = parseFloat(this.state.current_price);
    const position = selectedItem.cells[3].value;

    var player_map = this.state.player_map;
    var team_data = player_map[this.state.selectedTeam];
    var positional_info = team_data[position];

    const remaining_budget = computeRemainingMoney(team_data);

    if (price > remaining_budget) {
      this.setState({
        ...this.state,
        add_error_msg: 'Could not add player. Price PRICE more than remaining budget REM of TEAM!'
          .replace('PRICE', price)
          .replace('REM', remaining_budget)
          .replace('TEAM', this.state.selectedTeam),
      });
    } else if (
      team_data[position].length ===
      config['allowed_positions'].find(item => item.name === position).times
    ) {
      this.setState({
        ...this.state,
        add_error_msg: 'Position POS already full for team TEAM!'
          .replace('POS', position)
          .replace('TEAM', this.state.selectedTeam),
      });
    } else {
      const name = selectedItem.cells[1].value;
      const new_item = {
        name: name,
        pos: position,
        value: price,
      };

      positional_info.push(new_item);
      team_data[position] = positional_info;
      player_map[this.state.selectedTeam] = team_data;

      const new_player_list = this.state.player_list.filter(
        item => name !== makePlayerName(item)
      );

      this.setState({
        ...this.state,
        player_list: new_player_list,
        add_error_msg: '',
      });
    }
  };

  removePlayer(player_name, team_name) {
    var player_map = this.state.player_map;
    var team_data = player_map[team_name];

    Object.keys(team_data).forEach(position => {
      team_data[position] = team_data[position].filter(
        item => item.name !== player_name
      );
    });

    const cached_item = this.state.static_data.elements.find(
      item => makePlayerName(item) === player_name
    );
    var new_player_list = this.state.player_list;
    new_player_list.push(cached_item);

    this.setState({
      ...this.state,
      player_map: player_map,
      player_list: new_player_list,
    });
  }

  render() {
    const rows = this.state.player_list.map(row => ({
      ...row,
      id: row.id.toString(),
      name: makePlayerName(row),
      cr: row.creativity_rank,
      ir: row.influence_rank,
      tr: row.threat_rank,
      dr: row.draft_rank,
      team: getPlayerTeam(row, this.state.static_data),
      pos: getPlayerPosition(row, this.state.static_data),
    }));

    return (
      <Theme theme="g90" style={{ height: '100vh' }}>
        <Grid>
          <Column lg={7} md={8} sm={4}>
            <br />
            <br />
            <Tile>
              <TextInput
                invalid={Boolean(this.state.error_msg)}
                value={this.state.league_id}
                onChange={e => {
                  this.setState({
                    ...this.state,
                    league_id: e.target.value,
                  });
                }}
                id="league_id"
                labelText=""
                helperText="Enter your League ID here to fetch player data"
                invalidText={this.state.error_msg}
                placeholder={
                  'Enter League ID e.g. ' + config['default_league_id']
                }
              />
              <br />
              <Button
                onClick={this.fetchLeagueData.bind(this)}
                kind="primary"
                size="sm"
                style={{ marginRight: '10px' }}>
                Fetch
              </Button>

              <NewLink
                to={{
                  pathname: '/leaderboard',
                  state: { id: this.state.league_id },
                }}
                className="no-decoration-enforce">
                <Button
                  kind="tertiary"
                  size="sm"
                  style={{ marginRight: '10px' }}>
                  Go To League
                </Button>
              </NewLink>

              <Button
                hasIconOnly
                renderIcon={HelpFilled}
                iconDescription="Help"
                kind="ghost"
                size="sm"
                href="https://allaboutfpl.com/2023/07/what-is-team-id-in-fpl-how-to-get-a-low-fpl-team-id/#:~:text=Login%20to%20your%20FPL%20account,is%20your%20FPL%20team%20ID"
                target="_blank"
              />
            </Tile>

            <br />
            <br />
            {this.state.static_data && (
              <>
                <DataTable
                  rows={rows}
                  headers={infoTableHeaders}
                  isSortable={true}
                  render={({
                    rows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getSelectionProps,
                    getBatchActionProps,
                    getTableProps,
                    onInputChange,
                    selectedRows,
                  }) => (
                    <TableContainer
                      title="Player List"
                      description={
                        <p style={{ marginTop: '5px' }}>
                          CR = Creativity Rank, IR = Influence Rank, TR = Threat
                          Rank, DR = Draft Rank
                        </p>
                      }>
                      {Object.keys(this.state.player_map).length *
                        selectedRows.length >
                        0 && (
                        <>
                          <Dropdown
                            style={{ paddingLeft: '15px' }}
                            id="select-team"
                            titleText="Select Team to Add Player"
                            label="Select Team"
                            type="inline"
                            items={Object.keys(this.state.player_map).map(
                              item => {
                                return { id: item, text: item };
                              }
                            )}
                            itemToString={item => (item ? item.text : '')}
                            onChange={e =>
                              this.setState({
                                ...this.state,
                                selectedTeam: e.selectedItem.id,
                              })
                            }
                          />
                          {this.state.selectedTeam && (
                            <div
                              style={{
                                display: 'inline-table',
                                marginBottom: '10px',
                              }}>
                              <NumberInput
                                style={{ border: 'none' }}
                                helperText="Price"
                                hideSteppers
                                id="selection-value"
                                value={this.state.current_price}
                                min={config['minimum_price']}
                                max={computeRemainingMoney(
                                  this.state.player_map[this.state.selectedTeam]
                                )}
                                onChange={e =>
                                  this.setState({
                                    ...this.state,
                                    current_price: e.target.value,
                                  })
                                }
                                invalidText="Price is not valid"
                              />
                            </div>
                          )}
                        </>
                      )}
                      <TableToolbar>
                        <TableBatchActions {...getBatchActionProps()}>
                          {this.state.selectedTeam && (
                            <TableBatchAction
                              tabIndex={
                                getBatchActionProps().shouldShowBatchActions
                                  ? 0
                                  : -1
                              }
                              renderIcon={Add}
                              onClick={e => this.addPlayer(selectedRows[0])}>
                              Add
                            </TableBatchAction>
                          )}
                        </TableBatchActions>

                        <TableToolbarContent>
                          <TableToolbarSearch
                            placeholder="Search player by name"
                            onChange={onInputChange}
                          />
                          <TableToolbarMenu renderIcon={Bee}>
                            <TableToolbarAction
                              key="all_teams"
                              onClick={() => {
                                this.filterPlayers({ type: 'team', value: 0 });
                              }}>
                              All
                            </TableToolbarAction>
                            {this.state.static_data.teams.map(item => (
                              <TableToolbarAction
                                key={item.short_name}
                                onClick={e => {
                                  this.filterPlayers({
                                    type: 'team',
                                    value: item.id,
                                  });
                                }}>
                                {item.name}
                              </TableToolbarAction>
                            ))}
                          </TableToolbarMenu>
                          <TableToolbarMenu renderIcon={Soccer}>
                            <TableToolbarAction
                              key="all_positions"
                              onClick={() => {
                                this.filterPlayers({
                                  type: 'element_type',
                                  value: 0,
                                });
                              }}>
                              All
                            </TableToolbarAction>
                            {this.state.static_data.element_types.map(item => (
                              <TableToolbarAction
                                key={item.singular_name_short}
                                onClick={() => {
                                  this.filterPlayers({
                                    type: 'element_type',
                                    value: item.id,
                                  });
                                }}>
                                {item.singular_name}
                              </TableToolbarAction>
                            ))}
                          </TableToolbarMenu>
                          <Button
                            kind="secondary"
                            href={`data:text/json;charset=utf-8,${encodeURIComponent(
                              JSON.stringify(this.state.static_data, 0, 2)
                            )}`}
                            download={'data.json'}>
                            Export Data
                          </Button>
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table size="sm">
                        <TableHead>
                          <TableRow>
                            <TableHeader></TableHeader>
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
                          {rows
                            .slice(
                              this.state.firstRowIndex,
                              this.state.firstRowIndex +
                                this.state.currentPageSize
                            )
                            .map(row => (
                              <TableRow {...getRowProps({ row })}>
                                <TableSelectRow
                                  {...getSelectionProps({ row })}
                                  onChange={e =>
                                    this.setState({
                                      ...this.state,
                                      selectedTeam: null,
                                      current_price: 0,
                                    })
                                  }
                                />
                                {row.cells.map(cell => (
                                  <TableCell key={cell.id}>
                                    {cell.value}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                />
                <Pagination
                  style={{ width: '100%' }}
                  totalItems={rows.length}
                  backwardText="Previous page"
                  forwardText="Next page"
                  pageSize={this.state.currenPageSize}
                  pageSizes={[this.state.currentPageSize, 20, 30, 50]}
                  itemsPerPageText="Items per page"
                  onChange={({ page, pageSize }) => {
                    this.setState({
                      ...this.state,
                      currentPageSize: pageSize,
                      firstRowIndex: pageSize * (page - 1),
                    });
                  }}
                />
                <br />
                <br />
              </>
            )}

            {LINKS.map((item, id) => (
              <ClickableTile
                key={id}
                href={item.url}
                target="_blank"
                className="reference-tile">
                <img
                  alt={item.name}
                  src={generateUrl(
                    'images/' + item.name.toLowerCase().replaceAll(' ', '-')
                  )}
                />
              </ClickableTile>
            ))}

            <br />
            <br />
            <GitHubButton
              href="https://github.com/TathagataChakraborti/victims-of-weak-teams"
              data-size="small"
              data-show-count="true"
              aria-label="Stars on GitHub">
              Star
            </GitHubButton>
          </Column>
          <Column lg={9} md={8} sm={4}>
            <br />
            <br />

            {this.state.add_error_msg && (
              <InlineNotification
                style={{ marginBottom: '20px' }}
                lowContrast
                title="ERROR"
                subtitle={this.state.add_error_msg}
              />
            )}

            <Grid>
              {this.state.league_data && (
                <>
                  {this.state.league_data.league_entries
                    .filter(item => item.entry_name)
                    .map((item, id) => (
                      <TeamTile
                        key={id}
                        team_info={item}
                        team_data={this.state.player_map[item.entry_name]}
                        removePlayer={this.removePlayer.bind(this)}
                      />
                    ))}
                </>
              )}
            </Grid>

            {isAuctionDone(this.state.player_map) && (
              <>
                <Button
                  kind="primary"
                  size="sm"
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(
                      {
                        league_id: this.state.league_id,
                        static_data: this.state.static_data,
                        player_map: this.state.player_map,
                      },
                      0,
                      2
                    )
                  )}`}
                  download={'data.json'}>
                  Save
                </Button>
                <br />
                <br />
                <br />
              </>
            )}
          </Column>
        </Grid>
      </Theme>
    );
  }
}

export default LandingPage;
