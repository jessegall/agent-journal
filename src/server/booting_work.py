from core.base.actor import CORE_ACTOR_ID
from core.base.change.event_log import EventLog
from core.base.clock import Clock
from core.base.container import Container
from core.base.database.database import Database
from core.base.performance.performance_state import PerformanceState
from server.round_work import RoundWork


class BootingWork(RoundWork):
    """The one round as the server starts: logs journal.booting, which the listener thread answers once the server
    takes requests, so a restart keeps no agent waiting on the work that answers it."""

    def run(self, container: Container) -> None:
        container.get(PerformanceState).begin_start()
        with container.get(Database).transaction():
            container.get(EventLog).write_journal_booting(CORE_ACTOR_ID, container.get(Clock).timestamp().text)
            container.get(PerformanceState).keep_boot_event(container.get(EventLog).newest_id())
