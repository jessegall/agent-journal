from journal.console.support.chained_line import ChainedLine
from journal.features.briefing.feature import Briefing
from journal.repositories.setting_rows import SettingRows


class OverviewCommands:
    """The journal lines the overview after a compaction or a takeover hands the console to run, in the order the setting names them."""

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def lines(self) -> list[ChainedLine]:
        return [ChainedLine.runnable(command) for command in self.settings.texts(Briefing.OVERVIEW_COMMANDS)]
