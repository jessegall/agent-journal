from events.agents import AgentReported
from events.agents import ClockTicked
from resources.text import digest
from expects import Given, Nudged, Unchanged, Updated, Wrote
from framework.base import Feature
from resources.checks import Check
from resources.base import SYSTEM
from resources.types import AgentRow, Notification
from controllers.types import Checks
from features.checks.details import ChecksDetails
from features.checks.handlers import MarkTestRuns, ReportCheckResult, RunDueChecks
from events.checks import CheckUpdated
from framework.journal import Journal

__all__ = ["Checks"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
FAILING = "E501 line too long"
RAN = CheckUpdated(n=1, type="check", action="updated", actor=SYSTEM, ran=True)


def lint(output: str, ok: bool) -> Check:
    return Check(n=1, title="Lint", data={"command": "make lint", "last": {"ok": ok, "code": int(not ok), "at": 5.0, "output": output}})


class ChecksFeature(Feature):
    details = ChecksDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(RunDueChecks(), expects=[
            Given(ClockTicked(agent=1), rows=[Check(n=1, title="Lint", data={"command": "make lint"}), AGENT_ROW]) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(ReportCheckResult(), expects=[
            Given(RAN, rows=[lint(FAILING, ok=False), AGENT_ROW]) >> Wrote(Notification(title=f"check 1 failed - {FAILING}")) & Nudged("failed"),
            Given(RAN, rows=[lint(FAILING, ok=False), Notification(n=3, title="check 1 failed", refs=["check:1"], data={"reported": digest(FAILING, 12)}), AGENT_ROW]) >> Unchanged(),
            Given(RAN, rows=[lint("E999 syntax error", ok=False), Notification(n=3, title="check 1 failed", refs=["check:1"], data={"reported": digest(FAILING, 12)}), AGENT_ROW])
                >> Updated(Notification(n=3), outcome="the check reports something else now") & Wrote(Notification(title="check 1 failed - E999 syntax error")),
            Given(RAN, rows=[lint("all good", ok=True), Notification(n=3, title="check 1 failed", refs=["check:1"]), AGENT_ROW]) >> Updated(Notification(n=3), outcome="the check passes again"),
            Given(RAN, rows=[lint("all good", ok=True), AGENT_ROW]) >> Unchanged(),
            Given(CheckUpdated(n=1, type="check", action="updated", actor=SYSTEM, ran=False), rows=[lint(FAILING, ok=False), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(MarkTestRuns(), expects=[
            Given(AgentReported(agent=1), rows=[AGENT_ROW]) >> Unchanged(),
        ])
