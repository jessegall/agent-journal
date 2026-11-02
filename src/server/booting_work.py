from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.container import Container
from core.base.database.database import Database
from core.base.listener.commit_listener_runner import CommitListenerRunner
from server.round_work import RoundWork


class BootingWork(RoundWork):
    """The one round as the server starts: logs journal.booting and runs the listeners that answer it."""

    def run(self, container: Container) -> None:
        with container.get(Database).transaction():
            container.get(EventLog).write_journal_booting(CORE_ACTOR_ID, container.get(Clock).timestamp().text)
        container.get(CommitListenerRunner).run()
