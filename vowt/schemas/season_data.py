from pydantic import BaseModel, field_serializer
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Any
from vowt.schemas.constants import SourceModel, DATETIME_FORMAT


class Metadata(SourceModel):
    current_event: int
    current_event_finished: bool

    @classmethod
    def source_api(cls, **kwargs: Any) -> str:
        return "https://draft.premierleague.com/api/game"


class PointsExplanation(BaseModel):
    name: str
    points: int
    value: int
    stat: str


class PlayerGameWeekStats(BaseModel):
    minutes: int
    goals_scored: int
    assists: int
    clean_sheets: int
    yellow_cards: int
    red_cards: int
    expected_goals: float
    expected_assists: float
    total_points: int
    bonus: int


class PlayerDataGameWeek(BaseModel):
    explain: List[Tuple[List[PointsExplanation], int]]
    stats: PlayerGameWeekStats


class GameWeekData(SourceModel):
    elements: Dict[str, PlayerDataGameWeek]

    @classmethod
    def source_api(cls, **kwargs: Any) -> str:
        gameweek = kwargs.get("gameweek", None)
        assert gameweek is not None

        return f"https://draft.premierleague.com/api/event/{gameweek}/live"


class PlayerData(BaseModel):
    id: int
    code: int

    # Info
    first_name: str
    second_name: str
    web_name: str
    team: int
    element_type: int

    # Stats
    expected_goals: str
    expected_assists: str

    # Rankings
    draft_rank: int
    influence_rank: int
    creativity_rank: int
    threat_rank: int
    ict_index_rank: int

    # News
    news: str
    news_added: Optional[str]
    news_return: Optional[str]
    news_updated: Optional[str]


class ElementType(BaseModel):
    id: int
    element_count: int
    singular_name: str
    singular_name_short: str
    plural_name: str
    plural_name_short: str


class ElementStat(BaseModel):
    name: str
    label: str
    abbreviation: str


class TeamInfo(BaseModel):
    code: int
    id: int
    name: str
    short_name: str


class EventInfo(BaseModel):
    id: int
    name: str
    finished: bool


class EventsInfo(BaseModel):
    current: int
    data: List[EventInfo]


class StaticData(SourceModel):
    elements: List[PlayerData]
    element_types: List[ElementType]
    element_stats: List[ElementStat]
    teams: List[TeamInfo]
    events: EventsInfo

    @classmethod
    def source_api(cls, **kwargs: Any) -> str:
        return "https://draft.premierleague.com/api/bootstrap-static"


class SeasonData(BaseModel):
    last_updated: datetime
    metadata: Metadata
    player_data: StaticData
    gameweek_data: List[GameWeekData] = []

    @field_serializer("last_updated", when_used="json")
    def format_datetime(self, last_updated: datetime) -> str:
        return last_updated.strftime(DATETIME_FORMAT)
