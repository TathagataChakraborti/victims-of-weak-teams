import React from 'react';
import { Bee, Soccer } from '@carbon/icons-react';
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

const proxyURL = 'https://cors-proxy.fringe.zone/';
const static_api = 'https://draft.premierleague.com/api/bootstrap-static';

const headers = [
  { key: 'dr', header: 'DR' },
  { key: 'name', header: 'Name' },
  { key: 'team', header: 'Team' },
  { key: 'pos', header: 'POS' },
  { key: 'cr', header: 'CR' },
  { key: 'ir', header: 'IR' },
  { key: 'tr', header: 'TR' },
];

function getPlayerPosition(element, data) {
  if (!data) return null;

  const type_element = data.element_types.find(
    item => item.id === element.element_type
  );
  return type_element.singular_name_short;
}

function getPlayerTeam(element, data) {
  if (!data) return null;

  const team_element = data.teams.find(item => item.id === element.team);
  return team_element.short_name;
}

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league_id: '',
      player_search: '',
      static_data: null,
      player_list: [],
      current_type: '',
      currentPageSize: 15,
      firstRowIndex: 0,
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
        console.log(data);
        this.setState({
          ...this.state,
          static_data: data,
          player_list: data.elements,
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
          <Column lg={6} md={8} sm={4}>
            <br />
            <br />
            <Tile>
              <TextInput
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
                invalidText="A valid value is required"
                placeholder="gbcee2"
              />
              <br />
              <Button kind="primary" size="sm" style={{ marginRight: '10px' }}>
                Fetch
              </Button>
              <Button kind="tertiary" size="sm">
                Go To League
              </Button>
            </Tile>

            <br />
            <br />
            {this.state.static_data && (
              <>
                <DataTable
                  rows={rows}
                  headers={headers}
                  isSortable={true}
                  render={({
                    rows,
                    headers,
                    getHeaderProps,
                    getRowProps,
                    getTableProps,
                    onInputChange,
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
          <Column lg={10} md={8} sm={4}></Column>
        </Grid>
      </Theme>
    );
  }
}

export default LandingPage;
