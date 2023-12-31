import React from 'react';
import GitHubButton from 'react-github-btn';

import { LINKS } from './Links';
import { AuctionInformationModal } from './InformationModal';
import { TeamTile } from '../../components/BasicElements';
import { PageHeader } from '../../components/PageHeader';

import { Link as NewLink } from 'react-router-dom';
import { Bee, Soccer, InformationSquareFilled, Add } from '@carbon/icons-react';

import {
  initializeTeam,
  getPlayerPosition,
  getPlayerTeam,
  computeRemainingMoney,
  generateUrl,
  isAuctionDone,
  generateLeagueAPI,
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
  Button,
  Pagination,
  Dropdown,
  NumberInput,
  InlineNotification,
  ClickableTile,
  FileUploaderDropContainer,
  FileUploaderItem,
} from '@carbon/react';

import { GaugeChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const config = require('../../config.json');

const completionChartOptions = {
  title: 'Auction Progress',
  theme: 'g90',
  height: '200px',
  gauge: {
    type: 'full',
  },
};

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

const getAverage = arr =>
  arr.length ? arr.reduce((total, item) => total + item, 0) / arr.length : 0;

const getAllPlayersInTeam = team_map =>
  Object.values(team_map).reduce((bag, item) => bag.concat(item), []);

const getTeamProgress = team_map =>
  getAllPlayersInTeam(team_map).length /
  config.allowed_positions.reduce((total, item) => total + item.times, 0);

const getAuctionProgress = player_map => {
  const list_of_team_progress = Object.values(player_map).map(team_map =>
    getTeamProgress(team_map)
  );
  const average = getAverage(list_of_team_progress);

  return [
    {
      group: 'value',
      value: 100 * average,
    },
  ];
};

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
      current_price: config.minimum_price,
      player_map: {},
      error_msg: null,
      add_error_msg: null,
      uploadedFile: null,
      invalid_upload: false,
      modal_open: false,
    };
  }

  componentDidMount = () => {
    fetch(config.proxy_url + config.static_api, {
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
    } else {
      this.setState(
        {
          ...this.state,
          league_data: null,
          player_map: {},
        },
        () => {
          fetch(config.proxy_url + generateLeagueAPI(this.state.league_id), {
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
                error_msg: '',
                league_data: data,
                player_map: player_map,
              });
            })
            .catch(error => {
              this.setState({
                ...this.state,
                error_msg: invalid_league_id_msg,
              });
            });
        }
      );
    }
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
      config.allowed_positions.find(item => item.name === position).times
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

  uploadFile(e) {
    this.setState(
      {
        ...this.state,
        league_id: '',
        player_map: {},
        league_data: null,
      },
      () => {
        const file_object = e.target.files[0];
        const file_reader = new FileReader();

        file_reader.onload = async loadEvent => {
          const new_data = JSON.parse(loadEvent.target.result);

          if (new_data && new_data.player_map) {
            const all_player_list = Object.values(new_data.player_map)
              .map(team_map => getAllPlayersInTeam(team_map))
              .reduce((bag, item) => bag.concat(item, []))
              .map(item => item.name);

            const new_player_list = this.state.player_list.filter(
              item => all_player_list.indexOf(makePlayerName(item)) === -1
            );

            this.setState({
              ...this.state,
              league_id: new_data.league_id,
              player_map: new_data.player_map,
              league_data: new_data.league_data,
              uploadedFile: file_object.name,
              player_list: new_player_list,
              invalid_upload: false,
            });
          } else {
            this.setState({
              ...this.state,
              uploadedFile: file_object.name,
              invalid_upload: true,
            });
          }
        };

        file_reader.readAsText(file_object);
      }
    );
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
      <>
        <PageHeader />
        <Theme theme="g100" style={{ minHeight: '100vh' }}>
          <Grid>
            <Column lg={7} md={8} sm={4}>
              <br />
              <br />
              <Grid>
                <Column lg={4} md={4} sm={4}>
                  <Tile style={{ minHeight: '100%' }}>
                    <NumberInput
                      allowEmpty
                      hideSteppers
                      invalid={Boolean(this.state.error_msg)}
                      value={this.state.league_id}
                      onChange={e => {
                        this.setState({
                          ...this.state,
                          league_id: e.target.value,
                        });
                      }}
                      id="league_id"
                      helperText="Enter your League ID here to fetch player data"
                      invalidText={this.state.error_msg}
                      placeholder={
                        'Enter League ID e.g. ' + config.default_league_id
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
                      renderIcon={InformationSquareFilled}
                      iconDescription="Help"
                      kind="secondary"
                      size="sm"
                      href="https://allaboutfpl.com/2023/07/what-is-team-id-in-fpl-how-to-get-a-low-fpl-team-id/#:~:text=Login%20to%20your%20FPL%20account,is%20your%20FPL%20team%20ID"
                      target="_blank"
                    />
                    <br />
                    <br />
                    <div style={{ width: '75%' }}>
                      <FileUploaderDropContainer
                        accept={['application/json']}
                        labelText="Fetch to start new auction or upload saved auction file here."
                        multiple
                        name=""
                        onAddFiles={this.uploadFile.bind(this)}
                      />
                      <div className="cds--file-container cds--file-container--drop" />

                      {this.state.uploadedFile && (
                        <Theme theme="g100">
                          <FileUploaderItem
                            invalid={this.state.invalid_upload}
                            errorBody="Could not read auction data."
                            errorSubject="ERROR"
                            iconDescription="Delete file"
                            name={this.state.uploadedFile}
                            onDelete={() => {
                              this.setState({
                                ...this.state,
                                league_id: '',
                                league_data: null,
                                player_map: {},
                                player_list: this.state.static_data.elements,
                                uploadedFile: null,
                              });
                            }}
                            size="sm"
                            status="edit"
                          />
                        </Theme>
                      )}
                    </div>
                  </Tile>
                </Column>
                <Column lg={3} md={4} sm={4}>
                  <Tile style={{ paddingLeft: '25px', minHeight: '100%' }}>
                    <GaugeChart
                      data={getAuctionProgress(this.state.player_map)}
                      options={completionChartOptions}></GaugeChart>

                    <Button
                      style={{ marginTop: '25px' }}
                      kind={
                        isAuctionDone(this.state.player_map)
                          ? 'primary'
                          : 'secondary'
                      }
                      size="sm"
                      href={`data:text/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(
                          {
                            league_id: this.state.league_id,
                            static_data: this.state.static_data,
                            player_map: this.state.player_map,
                            league_data: this.state.league_data,
                          },
                          0,
                          2
                        )
                      )}`}
                      download={'data.json'}>
                      Save
                    </Button>
                  </Tile>
                </Column>
              </Grid>
              <AuctionInformationModal
                props={this.state}
                updateModalState={value =>
                  this.setState({ ...this.state, modal_open: value })
                }
              />
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
                      <TableContainer>
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
                                  min={config.minimum_price}
                                  max={computeRemainingMoney(
                                    this.state.player_map[
                                      this.state.selectedTeam
                                    ]
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
                                  this.filterPlayers({
                                    type: 'team',
                                    value: 0,
                                  });
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
                              {this.state.static_data.element_types.map(
                                item => (
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
                                )
                              )}
                            </TableToolbarMenu>
                            <Button
                              hasIconOnly
                              iconDescription="Information"
                              kind="ghost"
                              renderIcon={InformationSquareFilled}
                              onClick={() =>
                                this.setState({
                                  ...this.state,
                                  modal_open: true,
                                })
                              }>
                              {' '}
                            </Button>

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
              <br />
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
                    {[...Array(3).keys()].map(item => (
                      <Column key={item} lg={3} md={8} sm={4}>
                        {this.state.league_data.league_entries
                          .slice(
                            item *
                              Math.floor(
                                this.state.league_data.league_entries.length / 3
                              ),
                            (item + 1) *
                              Math.floor(
                                this.state.league_data.league_entries.length / 3
                              )
                          )
                          .filter(item => item.entry_name)
                          .map((item, id) => (
                            <TeamTile
                              key={id}
                              team_info={item}
                              team_data={this.state.player_map[item.entry_name]}
                              removePlayer={this.removePlayer.bind(this)}
                            />
                          ))}
                      </Column>
                    ))}
                  </>
                )}
              </Grid>
            </Column>
          </Grid>
        </Theme>
      </>
    );
  }
}

export default LandingPage;
