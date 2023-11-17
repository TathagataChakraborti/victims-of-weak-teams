import React from 'react';
import {
  getMoveObject,
  getTeamNameFromID,
  getPlayerNameFromID,
  getPosition,
  getGameweekPoints,
  getTotalPoints,
  getCurrentGW,
  getCurrentGWStatus,
} from './DataProcessors';
import {
  DataTable,
  Table,
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Tag,
} from '@carbon/react';

const leaderboardHeaders = [
  { key: 'move', header: 'POS' },
  { key: 'name', header: 'Name' },
  { key: 'h2h', header: 'H2H' },
  { key: 'gw_points', header: 'GW' },
  { key: 'total_points', header: 'Points' },
];

const Leaderboard = props => {
  var rows = !props.league_data
    ? []
    : props.league_data.standings
        .filter(item => getTeamNameFromID(item.league_entry, props.league_data))
        .map(row => ({
          ...row,
          id: row.league_entry.toString(),
          move: getMoveObject(row.league_entry, props.league_data),
          name: (
            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
              <div>
                {getTeamNameFromID(row.league_entry, props.league_data)}
              </div>
              <div
                style={{
                  marginTop: '5px',
                  fontSize: 'smaller',
                  color: 'gray',
                }}>
                {getPlayerNameFromID(row.league_entry, props.league_data)}
              </div>
            </div>
          ),
          h2h: row.total,
          position: getPosition(row.league_entry, props.league_data),
          gw_points: getGameweekPoints(row.league_entry, props.league_data),
          total_points: getTotalPoints(row.league_entry, props.league_data),
        }));

  rows.sort(function(a, b) {
    return a.position - b.position;
  });

  return (
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
          title={props.league_data.league.name}
          description={
            <>
              <div className="table-tag">
                <Tag className="team-tag">League ID</Tag>
                <Tag type="purple" className="team-tag">
                  {props.league_data.league.id}
                </Tag>
              </div>
              <div className="table-tag">
                <Tag className="team-tag">
                  Gameweek {getCurrentGW(props.league_data)}
                </Tag>
                <Tag
                  type={
                    getCurrentGWStatus(props.league_data) ? 'green' : 'magenta'
                  }
                  className="team-tag">
                  {getCurrentGWStatus(props.league_data) ? 'DONE' : 'LIVE'}
                </Tag>
              </div>
            </>
          }>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map(header => (
                  <TableHeader key={header.key} {...getHeaderProps({ header })}>
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
  );
};

export { Leaderboard };
