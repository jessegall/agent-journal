from functools import cached_property

from events.measured import Measured
from expects import Dispatches, File, Given, Removed, Replied, Requested, Told, Unchanged, Updated, Wrote, answering, nothing
from expects.watching import BROKEN
from framework.base import Feature
from framework.journal import Journal
from features.dev_faults.details import DevFaultsDetails
from events.dev_faults import OverdueTodoClosed, OverdueTodoFiled
from features.dev_faults.handlers import LiftOverdueHold, ReportSlow, RestartCountOnClose
from features.dev_faults.listeners import SpotOverdueTodoClosed, SpotOverdueTodoFiled
from events.todos import TodoCompleted
from events.resources import ResourceCreated
from resources.types import AgentRow, Notification, Todo, Work
from features.dev_faults.reports import Reporting
from features.dev_faults.reports import OVER
from features.dev_faults.routes import get_diagnostics, post_clear_diagnostics


SLOW_TITLE = f"request /api/summary {OVER}"
BREACH = Measured(root="/nowhere", env="t", kind="command", target="message all", took=400.0, working=400.0)
BREACH_TITLE = f"command message all {OVER}"
ENVIRONMENTS = answering({("environments",): ["t"]})
ON = {".dev_faults": True}
CLAUDE = AgentRow(n=1, title="claude-1")


class DevFaults(Feature):
    details = DevFaultsDetails
    default = False

    @classmethod
    def default_for(cls, root) -> bool:
        """On where the journal develops itself, off everywhere else. What it reports - a request over its budget, an error the viewer threw - is for whoever builds the journal; a project that merely runs on it is told none of it until its user asks to be."""
        return root.developing()

    def register(self, journal: Journal) -> None:
        journal.events.handle(Measured, ReportSlow(), expects=[
            Given(Measured(root="/nowhere", env="t", kind="command", target="message all", took=40.0, working=40.0), settings={**ON, "dev_faults.budget.command": 10}, journal_root=ENVIRONMENTS)
                >> Unchanged(),
            Given(BREACH, settings={**ON, "dev_faults.budget.command": 0}, journal_root=ENVIRONMENTS) >> Unchanged(),
            Given(BREACH, settings=ON, journal_root=answering({("environments",): ["t"], ("warming",): True})) >> Unchanged(),
            Given(BREACH, settings=ON, rows=[CLAUDE, Work(n=1, title="the release", data={"awaiting": "the CI run"})], journal_root=ENVIRONMENTS)
                >> Wrote(Notification(title=BREACH_TITLE)) & Told("fault", times=0),
            Given(BREACH, settings=ON, rows=[CLAUDE, Work(n=1, title="the release", data={"awaiting": ""})], journal_root=ENVIRONMENTS)
                >> Wrote(Notification(title=BREACH_TITLE)) & Told("fault"),
            Given(Measured(root="/nowhere", env="t", kind="request", target="/api/summary", took=4.0, working=3.0)) >> Unchanged(),
            Given(Measured(root="/nowhere", env="t", kind="command", target="check run", took=400.0, working=400.0), settings={".dev_faults": True},
                  journal_root=answering({("environments",): ["t"]}))
                >> Wrote(Notification(title="command check run is slower than its budget")),
            Given(Measured(root="/nowhere", env="t", kind="command", target="check run", took=400.0, working=400.0), journal_root=answering({("environments",): ["t"]})) >> Unchanged(),
        ])
        journal.events.listen(ResourceCreated, SpotOverdueTodoFiled(), expects=[
            Given(ResourceCreated(n=2, type="todo"), rows=[Todo(n=2, title=SLOW_TITLE)]) >> Dispatches(OverdueTodoFiled(title=SLOW_TITLE)),
            Given(ResourceCreated(n=2, type="todo"), rows=[Todo(n=2, title="the header")]) >> Dispatches(nothing),
            Given(ResourceCreated(n=2, type="message"), rows=[Todo(n=2, title=SLOW_TITLE)]) >> Dispatches(nothing),
        ])
        journal.events.handle(OverdueTodoFiled, LiftOverdueHold(), expects=[
            Given(OverdueTodoFiled(title=SLOW_TITLE), journal_root=answering({("environments",): ["t"]})) >> Unchanged(),
        ])
        journal.events.listen(TodoCompleted, SpotOverdueTodoClosed(), expects=[
            Given(TodoCompleted(n=2, type="todo"), rows=[Todo(n=2, title=SLOW_TITLE)]) >> Dispatches(OverdueTodoClosed(title=SLOW_TITLE)),
            Given(TodoCompleted(n=2, type="todo"), rows=[Todo(n=2, title="the header")]) >> Dispatches(nothing),
        ])
        journal.events.handle(OverdueTodoClosed, RestartCountOnClose(), expects=[
            Given(OverdueTodoClosed(title=SLOW_TITLE), rows=[Notification(n=1, title=SLOW_TITLE, data={"times": 5})], journal_root=answering({("environments",): ["t"]}))
                >> Updated(Notification(n=1), times=0),
            Given(OverdueTodoClosed(title="the header"), rows=[Notification(n=1, title=SLOW_TITLE, data={"times": 5})], journal_root=answering({("environments",): ["t"]})) >> Unchanged(),
        ])
        journal.routes.add(get_diagnostics, expects=[
            Given(Requested(query={"lines": "50"}), files=answering({".journal/runtime/diagnostics.log": "slow request GET /api/main/message 80ms"}))
                >> Replied(200, {"log": "slow request GET /api/main/message 80ms"}),
        ])
        journal.routes.add(post_clear_diagnostics, expects=[
            Given(Requested(), files=answering({".journal/runtime/diagnostics.log": "x"})) >> Replied(200, {"log": ""}) & Removed(File(".journal/runtime/diagnostics.log")),
        ])
        BROKEN.add(self, self.reports.broken)

    @cached_property
    def reports(self) -> Reporting:
        return Reporting()
