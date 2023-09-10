import React from 'react';
import { Bee, Soccer, HelpFilled, Add } from '@carbon/icons-react';
import { TeamTile } from '../../components/BasicElements';
import {
  infoTableHeaders,
  initializeTeam,
  isAuctionDone,
  getPlayerPosition,
  getPlayerTeam,
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
} from '@carbon/react';

const invalid_league_id_msg = 'Please provide valid league ID';
const proxyURL = 'https://cors-proxy.fringe.zone/';
const static_api = 'https://draft.premierleague.com/api/bootstrap-static';
const league_api =
  'https://draft.premierleague.com/api/league/{league_id}/details';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league_id: '81463',
      player_search: '',
      static_data: null,
      player_list: [],
      current_type: '',
      currentPageSize: 10,
      firstRowIndex: 0,
      player_map: null,
    };
  }

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

  componentDidMount = () => {
    fetch(proxyURL + static_api, {
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

  fetchLeagueData = () => {
    if (!this.state.league_id) {
      this.setState({
        ...this.state,
        error_msg: invalid_league_id_msg,
      });

      return null;
    }

    const url = league_api.replace('{league_id}', this.state.league_id);
    fetch(proxyURL + url, {
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

  render() {
    const rows = this.state.player_list.map(row => ({
      ...row,
      name: row.first_name + ' ' + row.second_name,
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
          <Column lg={7} md={4} sm={2}>
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
                placeholder="81463"
              />
              <br />
              <Button
                onClick={this.fetchLeagueData.bind(this)}
                kind="primary"
                size="sm"
                style={{ marginRight: '10px' }}>
                Fetch
              </Button>
              <Button
                href={'/' + this.state.league_id}
                kind="tertiary"
                size="sm"
                style={{ marginRight: '10px' }}>
                Go To League
              </Button>
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
                    infoTableHeaders,
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
                      <TableToolbar>
                        <TableBatchActions {...getBatchActionProps()}>
                          <TableBatchAction
                            tabIndex={
                              getBatchActionProps().shouldShowBatchActions
                                ? 0
                                : -1
                            }
                            renderIcon={Add}
                            onClick={e => console.log('clicked', selectedRows)}>
                            Add
                          </TableBatchAction>
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
                                  onChange={e => {
                                    console.log(this);
                                  }}
                                  {...getSelectionProps({ row })}
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
                  pageSizes={[this.state.currentPageSize, 10, 20, 30, 50]}
                  itemsPerPageText="Items per page"
                  onChange={({ page, pageSize }) => {
                    this.setState({
                      ...this.state,
                      currentPageSize: pageSize,
                      firstRowIndex: pageSize * (page - 1),
                    });
                  }}
                />
              </>
            )}
          </Column>
          <Column lg={9} md={4} sm={2}>
            <br />
            <br />

            <Grid>
              {this.state.league_data && (
                <>
                  {this.state.league_data.league_entries
                    .filter(item => item.entry_name)
                    .map(item => (
                      <TeamTile
                        team_info={item}
                        team_data={this.state.player_map[item.entry_name]}
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
                    JSON.stringify(this.state, 0, 2)
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
