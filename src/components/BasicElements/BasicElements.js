import React from 'react';
import { allowedPositions, computeRemainingMoney } from '../../components/Info';
import {
  Column,
  Theme,
  Tile,
  Tag,
  ContainedList,
  ContainedListItem,
} from '@carbon/react';

class TeamTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team_info: props.team_info,
      team_data: props.team_data,
    };
  }

  render() {
    return (
      <Column lg={3} md={2} sm={2} className="team-card">
        <Tile className="team-tile">
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

            {Object.keys(this.state.team_data).map(position => {
              return (
                <Theme theme="g100">
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
                            allowedPositions.find(
                              item => item.name === position
                            ).times
                          }
                        </Tag>
                      </div>
                    }
                    kind="disclosed">
                    {this.state.team_data[position].map(player => (
                      <ContainedListItem>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}>
                          <span>{player.name}</span>
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
      </Column>
    );
  }
}

export { TeamTile };
