const OUTLINE = [
  {
    name: 'Leaderboard',
    children: null,
    home: true,
  },
  {
    name: 'The Auction',
    children: ['Auction Snapshot', 'No Value in the Market'],
    hashit: true,
  },
  {
    name: 'Player Data',
    children: [
      'Influence Map',
      'Points Breakdown by Position',
      'Points Breakdown by Type',
    ],
  },
  {
    name: 'League Ranking',
    children: null,
  },
  {
    name: 'Player Cards',
    children: null,
  },
];

function getHomeName() {
  return OUTLINE.find(item => item.home).name;
}

function isHome(name) {
  return name === getHomeName();
}

function transformRouteString(string) {
  return string.toLowerCase().replaceAll(' ', '-');
}

function createRoute(item, child, hashit) {
  const connector_string = hashit ? '#' : '-';
  return (
    transformRouteString(item.name) +
    connector_string +
    transformRouteString(child)
  );
}

export { OUTLINE, getHomeName, isHome, transformRouteString, createRoute };
