const config = require('../../config.json');

function generateUrl(url) {
  return `${process.env.PUBLIC_URL}/${url}.png`;
}

function generateLeagueAPI(league_id) {
  return config.league_api.replace(
    '{LEAGUE_ID}',
    league_id ? league_id : '{LEAGUE_ID}'
  );
}

function computeRemainingMoney(player_map_item) {
  var current_value = 0.0;

  Object.keys(player_map_item).forEach(item => {
    current_value += player_map_item[item].reduce(
      (total, i) => total + i.value,
      0
    );
  });

  return config['total_budget'] - current_value;
}

function initializeTeam() {
  var team_data = {};

  config['allowed_positions'].forEach(item => {
    team_data[item.name] = [];
  });

  return team_data;
}

function isAuctionDone(player_map) {
  if (!Object.keys(player_map).length) return false;

  const players_per_team = config['allowed_positions'].reduce(
    (total, item) => total + item.times,
    0
  );
  var is_done = true;

  Object.keys(player_map).forEach(player_name => {
    var num_players = 0;

    Object.keys(player_map[player_name]).forEach(item => {
      num_players += player_map[player_name][item].length;
    });

    is_done = is_done && num_players === players_per_team;
  });

  return is_done;
}

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

export {
  generateUrl,
  generateLeagueAPI,
  computeRemainingMoney,
  initializeTeam,
  isAuctionDone,
  getPlayerPosition,
  getPlayerTeam,
};
