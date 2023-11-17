import { CaretUp, CaretDown, Subtract } from '@carbon/icons-react';

function monoMalinyo(id) {
  return id === 343164 ? 10 : 0;
}

function getPointsArrayFromID(id, league_data) {
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
}

function getTotalPoints(id, league_data, gameweek) {
  var all_points_array = getPointsArrayFromID(id, league_data);
  var gw =
    typeof gameweek === 'undefined' ? getCurrentGW(league_data) : gameweek;

  all_points_array = all_points_array.filter(item => item.gameweek <= gw);

  return all_points_array.reduce((total, item) => total + item.points, 0);
}

function getGameweekPoints(id, league_data, gameweek) {
  const points_array = getPointsArrayFromID(id, league_data);
  const gw =
    typeof gameweek === 'undefined' ? getCurrentGW(league_data) : gameweek;

  const points = points_array.find(item => item.gameweek === gw).points;

  return points ? points : 0;
}

function getTeamNameFromID(id, league_data) {
  return league_data.league_entries.find(item => id === item.id).entry_name;
}

function getPlayerNameFromID(id, league_data) {
  const league_item = league_data.league_entries.find(item => id === item.id);
  return league_item.player_first_name + ' ' + league_item.player_last_name;
}

function getCurrentGW(league_data) {
  var cache = league_data.matches.findLast(match => match.started);
  return cache ? cache.event : 1;
}

function getCurrentGWStatus(league_data) {
  var cache = league_data.matches.findLast(match => match.started);
  return cache && cache.finished;
}

function getMoveObject(id, league_data) {
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
}

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

export {
  getPosition,
  getMoveObject,
  getCurrentGWStatus,
  getCurrentGW,
  getPlayerNameFromID,
  getTeamNameFromID,
  getGameweekPoints,
  getTotalPoints,
  getPointsArrayFromID,
};
