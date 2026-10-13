from events import Fact
from events.dev_faults import OverdueTodoClosed, OverdueTodoFiled
from events.measured import Measured
from features.dev_faults.reports import FaultReports
from receiving import Handler
from serving import Elsewhere, JournalRoot


class ReportSlow(Handler[Measured]):
    def handle(self, event: Measured, elsewhere: Elsewhere, root: JournalRoot) -> list[Fact]:
        FaultReports(elsewhere, root).spent(event.env, event.kind, event.target, event.took, event.working, event.profile, event.garbage, event.waiting,
                                            event.after, event.whole_reads, event.stacks, event.request, event.within)
        return []


class LiftOverdueHold(Handler[OverdueTodoFiled]):
    def handle(self, event: OverdueTodoFiled, elsewhere: Elsewhere, root: JournalRoot) -> list[Fact]:
        FaultReports(elsewhere, root).lift(event.title)
        return []


class RestartCountOnClose(Handler[OverdueTodoClosed]):
    def handle(self, event: OverdueTodoClosed, elsewhere: Elsewhere, root: JournalRoot) -> list[Fact]:
        FaultReports(elsewhere, root).restart(event.title)
        return []
