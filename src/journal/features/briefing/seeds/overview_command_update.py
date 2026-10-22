from journal.features.seed import Seed
from journal.repositories.setting_rows import SettingRows
from journal.support.actor import Actor

PLACEHOLDERS = ("{{started_plan}}", "{{task_in_hand}}")


class OverviewCommandUpdate(Seed):
    """A stored list of the overview's commands still naming the plan or the task in hand by a placeholder is written with the word current instead, which plan show and task show read themselves."""

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def run(self) -> None:
        from journal.features.briefing.feature import Briefing
        stored = self.settings.project(Briefing.OVERVIEW_COMMANDS.key)
        if isinstance(stored, list) and any(placeholder in line for line in stored for placeholder in PLACEHOLDERS):
            self.settings.set(Briefing.OVERVIEW_COMMANDS.key, [self.current(line) for line in stored], Actor.system())

    @staticmethod
    def current(line: str) -> str:
        for placeholder in PLACEHOLDERS:
            line = line.replace(placeholder, "current")
        return line
