import React from 'react';
import { computeRemainingMoney } from '../../components/Info';
import { Subtract } from '@carbon/icons-react';
import {
  Theme,
  Tile,
  Tag,
  ContainedList,
  ContainedListItem,
  Button,
} from '@carbon/react';

const config = require('../../config.json');

class TeamTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team_info: props.team_info,
      team_data: props.team_data,
    };
  }

  removePlayer = player_name => {
    this.props.removePlayer(player_name, this.state.team_info.entry_name);
  };

  render() {
    return (
      <Tile className="team-card team-tile">
        <Tag size="sm" type="purple" className="team-tag">
          {this.state.team_info.player_first_name}{' '}
          {this.state.team_info.player_last_name}
        </Tag>
        <div className="team-card-body">
          <h6 className="team-header">{this.state.team_info.entry_name}</h6>

          <div style={{ marginBottom: '5px' }}>
            <ContainedList
              size="sm"
              label={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <span>Remaining Budget</span>
                  <Tag
                    className="team-tag"
                    type="teal"
                    size="sm"
                    role="status"
                    aria-label={100.0 + ' remaining'}>
                    {computeRemainingMoney(this.state.team_data)}
                  </Tag>
                </div>
              }
              kind="disclosed"></ContainedList>
          </div>

          {Object.keys(this.state.team_data).map((position, id) => {
            return (
              <Theme key={id} theme="g100">
                <ContainedList
                  size="sm"
                  label={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <span>{position}</span>
                      <Tag
                        className="team-tag"
                        size="sm"
                        role="status"
                        aria-label={
                          this.state.team_data[position].length +
                          ' items in list'
                        }>
                        {this.state.team_data[position].length} /{' '}
                        {
                          config['allowed_positions'].find(
                            item => item.name === position
                          ).times
                        }
                      </Tag>
                    </div>
                  }
                  kind="disclosed">
                  {this.state.team_data[position].map((player, pid) => (
                    <ContainedListItem key={pid}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <Button
                          onClick={this.removePlayer.bind(this, player.name)}
                          style={{ marginRight: '5px' }}
                          renderIcon={Subtract}
                          kind="ghost"
                          size="sm"
                          iconDescription="Remove from team"
                          hasIconOnly
                        />
                        <span style={{ fontSize: 'smaller' }}>
                          {player.name}
                        </span>
                        <Tag
                          className="team-tag"
                          style={{ backgroundColor: 'black' }}
                          type="gray"
                          size="sm"
                          role="status">
                          {player.value}
                        </Tag>
                      </div>
                    </ContainedListItem>
                  ))}
                </ContainedList>
              </Theme>
            );
          })}
        </div>
      </Tile>
    );
  }
}

export { TeamTile };
