from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from suites.coding.modules.checks.commands.record_check_progress.record_check_progress import RecordCheckProgress
from suites.coding.modules.checks.models.check import Check
from core.base.change.journal_booting import JournalBooting


class EndedCheckRunsListener(CommitListener[JournalBooting]):
    """As the journal starts, no check is running any more, so a percent left from before it stopped is cleared."""

    name = "checks.ended-check-runs"

    def __init__(self, queries: Queries, bus: Bus) -> None:
        self.queries, self.bus = queries, bus

    def handle(self, event: JournalBooting, logged: LoggedEvent) -> None:
        for check in tuple(self.queries.query(Check).all_rows()):
            if check.run_percent is not None:
                self.bus.run(RecordCheckProgress(check.id, None), Actor.core())
