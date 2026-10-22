from datetime import datetime

from journal.models.notice import Notice
from journal.repositories.environments import Environments
from journal.repositories.notices import Notices
from journal.repositories.scope import Scope
from journal.support.actor import Actor

SESSION_RESTART_VERSION = "4.5.0"
NOTICE_TITLE = "This journal needs a restart after the latest install"
RESTART_TONE = "restart"
RETIRED_TITLES = ("The journal was updated to 4.5: end the agent's session and start a new one, so it works with the new version", "Quit the agent and start it again once, so it runs commands through the journal",)


class SessionRestart:
    """An update that crosses the version whose hooks, states and skills a running session cannot take up is told to the user in every environment as a notice of the restart tone, which the viewer draws as a dialog that cannot be dismissed, until the agent's next session starts; a notice in an earlier wording is closed the same way."""

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
                self.notices.save(Notice(environment_id=environment.row_id, title=NOTICE_TITLE, tone=RESTART_TONE), Actor.system())

    def close(self, time: datetime) -> None:
        for notice in [n for n in self.notices.open_scoped() if n.title in (NOTICE_TITLE, *RETIRED_TITLES)]:
            self.notices.save(notice.closed(time), Actor.system())
