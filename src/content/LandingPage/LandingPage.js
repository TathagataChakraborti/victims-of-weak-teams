import React from 'react';
import {
  DataTable,
  Theme,
  Grid,
  Column,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
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
  { key: 'name', header: 'Name' },
  { key: 'team', header: 'Team' },
  { key: 'pos', header: 'POS' },
  { key: 'cr', header: 'CR' },
  { key: 'ir', header: 'IR' },
  { key: 'tr', header: 'TR' },
  { key: 'dr', header: 'DR' },
];

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      league_id: '',
      player_search: '',
      static_data: null,
      currentPageSize: 10,
      firstRowIndex: 0,
    };
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
        console.log(data.elements);
        this.setState({
          ...this.state,
          static_data: data,
        });
      });
  };

  onLeagueIDInputChange = e => {
    this.setState({
      ...this.state,
      league_id: e.target.value,
    });
  };

  onTableInputChange = e => {
    this.setState({
      ...this.state,
      player_search: e.target.value,
    });
  };

  render() {
    const rows = !this.state.static_data
      ? []
      : this.state.static_data.elements.map(row => ({
          ...row,
          name: row.first_name + ' ' + row.second_name,
          cr: row.creativity_rank,
          ir: row.influence_rank,
          tr: row.threat_rank,
          dr: row.draft_rank,
          team: '',
          pos: '',
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
                onChange={this.onLeagueIDInputChange.bind(this)}
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
                  }) => (
                    <TableContainer title="Player List">
                      <TableToolbar>
                        <TableToolbarContent>
                          <TableToolbarSearch
                            value={this.state.player_search}
                            onChange={this.onTableInputChange.bind(this)}
                          />
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table {...getTableProps()}>
                        <TableHead isSortable>
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
                  pageSizes={[this.state.currentPageSize, 5, 10, 15, 25]}
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
