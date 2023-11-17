import {
  getCurrentGW,
  getPointsArrayFromID,
  getTotalPoints,
  getPosition,
  getGameweekPoints,
} from './DataProcessors.js';
import { LineChart, AreaChart } from '@carbon/charts-react';

import '@carbon/charts/styles.css';

const ChartOptions = {
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
};

const TrendCumulative = props => {
  var data = [];
  props.league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(
        entry.id,
        props.league_data
      ).map(item => {
        return {
          group: entry.entry_name,
          gameweek: item.gameweek,
          points: getTotalPoints(entry.id, props.league_data, item.gameweek),
        };
      });

      data = data.concat(all_points_array);
    });

  var options = JSON.parse(JSON.stringify(ChartOptions));
  options.axes.left.title = 'Cumulative Points';
  options.height = props.height;

  return <LineChart data={data} options={options}></LineChart>;
};

const TrendPositional = props => {
  var data = [];
  props.league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(
        entry.id,
        props.league_data
      ).map(item => {
        return {
          group: entry.entry_name,
          gameweek: item.gameweek,
          points: getPosition(entry.id, props.league_data, item.gameweek),
        };
      });

      data = data.concat(all_points_array);
    });

  var options = JSON.parse(JSON.stringify(ChartOptions));
  options.axes.left.title = 'Gameweek Positions';
  options.axes.left.scaleType = 'labels';
  options.axes.left.domain = Array(props.size)
    .fill()
    .map((item, id) => id + 1)
    .reverse();
  options.axes.bottom.domain = [1, getCurrentGW(props.league_data)];
  options.height = props.height;

  return <LineChart data={data} options={options}></LineChart>;
};

const TrendDaily = props => {
  var data = [];
  props.league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(
        entry.id,
        props.league_data
      ).map(item => {
        return {
          group: entry.entry_name,
          gameweek: item.gameweek,
          points: getGameweekPoints(entry.id, props.league_data, item.gameweek),
        };
      });

      data = data.concat(all_points_array);
    });

  var options = JSON.parse(JSON.stringify(ChartOptions));
  options.axes.bottom.domain = [1, getCurrentGW(props.league_data)];
  options.axes.left.title = 'Gameweek Points';
  options.height = props.height;

  return <AreaChart data={data} options={options}></AreaChart>;
};

const TrendAverage = props => {
  var data = [];
  props.league_data.league_entries
    .filter(entry => entry.entry_name)
    .forEach(entry => {
      const all_points_array = getPointsArrayFromID(entry.id, props.league_data)
        .filter(item => item.gameweek)
        .map(item => {
          return {
            group: entry.entry_name,
            gameweek: item.gameweek,
            points:
              getTotalPoints(entry.id, props.league_data, item.gameweek) /
              item.gameweek,
          };
        });

      data = data.concat(all_points_array);
    });

  var options = JSON.parse(JSON.stringify(ChartOptions));
  options.axes.left.domain = [
    Math.min(...data.map(item => item.points)),
    Math.max(...data.map(item => item.points)),
  ];
  options.axes.left.title = 'Average Points';
  options.height = props.height;

  return <LineChart data={data} options={options}></LineChart>;
};

const TrendAverageDifferential = props => {
  var data = [];
  var average_team_id = props.league_data.league_entries.find(
    entry => !entry.entry_name
  ).id;

  props.league_data.league_entries.forEach(entry => {
    const all_points_array = getPointsArrayFromID(
      entry.id,
      props.league_data
    ).map((item, id) => {
      const average_team_points = getTotalPoints(
        average_team_id,
        props.league_data,
        item.gameweek
      );
      return {
        group: entry.entry_name ? entry.entry_name : 'AVERAGE',
        gameweek: item.gameweek,
        points:
          getTotalPoints(entry.id, props.league_data, item.gameweek) -
          average_team_points,
      };
    });

    data = data.concat(all_points_array);
  });

  var options = JSON.parse(JSON.stringify(ChartOptions));
  options.axes.left.domain = [
    Math.min(...data.map(item => item.points)),
    Math.max(...data.map(item => item.points)),
  ];
  options.axes.left.title = 'Points Difference from Average';
  options.height = props.height;

  return <LineChart data={data} options={options}></LineChart>;
};

const TrendOptions = [
  {
    name: 'Cumulative',
    component: TrendCumulative,
  },
  {
    name: 'Positional',
    component: TrendPositional,
  },
  {
    name: 'Daily',
    component: TrendDaily,
  },
  {
    name: 'Average',
    component: TrendAverage,
  },
  {
    name: 'Differential',
    component: TrendAverageDifferential,
  },
];

const TrendCurve = props => {
  const ResolvedComponent = TrendOptions.find(item => item.name === props.name)
    .component;
  const num_members = props.league_data.league_entries.filter(
    entry => entry.entry_name
  ).length;
  const chart_height = (num_members * 80).toString() + 'px';

  return (
    <ResolvedComponent
      size={num_members}
      height={chart_height}
      league_data={props.league_data}
    />
  );
};

export { TrendCurve, TrendOptions };
