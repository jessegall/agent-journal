from datetime import datetime

from journal.models.notice import Notice
from journal.repositories.environments import Environments
from journal.repositories.notices import Notices
from journal.repositories.scope import Scope
from journal.support.actor import Actor

SESSION_RESTART_VERSION = "4.5.0"
NOTICE_TITLE = "Quit the agent and start it again once, so it runs commands through the journal"


class SessionRestart:
    """An update that crosses the version whose shell runner a running session cannot take up is told to the user as a notice in every environment, until the agent's next session starts."""

    def __init__(self, notices: Notices, environments: Environments, scope: Scope) -> None:
        self.notices, self.environments, self.scope = notices, environments, scope

    @classmethod
    def is_crossed(cls, previous: str, current: str) -> bool:
        return cls.numbers(previous) < cls.numbers(SESSION_RESTART_VERSION) <= cls.numbers(current)

    @staticmethod
    def numbers(version: str) -> tuple[int, ...]:
        return tuple(int(n) for n in version.split("."))

    def notice(self) -> None:
        for environment in self.environments.all():
            with self.scope.environment(environment.row_id):
                self.notices.save(Notice(environment_id=environment.row_id, title=NOTICE_TITLE, tone="warn"), Actor.system())

    def close(self, time: datetime) -> None:
        for notice in [n for n in self.notices.open_scoped() if n.title == NOTICE_TITLE]:
            self.notices.save(notice.closed(time), Actor.system())
