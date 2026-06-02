from vowt.scripts.update_season_info import update_season_info


class TestSeasonInfo:
    def setup_method(self) -> None:
        pass

    def test_update_season_info(self) -> None:
        data = update_season_info(timeout=5)
        assert data
