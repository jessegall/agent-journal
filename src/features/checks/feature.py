from events.agents import AgentReported
from events.agents import ClockTicked
from resources.text import digest
from expects import WHEN, Dispatches, Given, Nudged, Unchanged, Updated, Wrote, nothing
from framework.base import Feature
from resources.checks import Check
from resources.base import SYSTEM
from resources.types import AgentRow, Notification
from controllers.types import Checks
from features.checks.details import ChecksDetails
from features.checks.handlers import FileFailingCheck, ForgetDeadRuns, MarkPassingCheck, SettlePassingCheck, ShowTestsFinished, ShowTestsRunning, StartDueCheck, TellAgentOfFailingCheck
from features.checks.listeners import SpotCheckResult, SpotDueChecks, SpotTestRuns
from events.checks import CheckDue, CheckFailed, CheckPassedAgain, CheckUpdated, TestsFinished, TestsRunning
from framework.journal import Journal

__all__ = ["Checks"]


AGENT_ROW = AgentRow(n=1, title="claude-1")
FAILING = "E501 line too long"
RAN = CheckUpdated(n=1, type="check", action="updated", actor=SYSTEM, ran=True)


def lint(output: str, ok: bool) -> Check:
    return Check(n=1, title="Lint", data={"command": "make lint", "last": {"ok": ok, "code": int(not ok), "at": 5.0, "output": output}})


def filed(output: str) -> Notification:
    return Notification(n=3, title="check 1 failed", refs=["check:1"], data={"reported": digest(output, 12)})


def failed(output: str, stale: tuple[int, ...]) -> CheckFailed:
    return CheckFailed(check=1, about="check:1", title=f"check 1 failed - {output}", headline=output, output=output, reported=digest(output, 12), stale=stale)


class ChecksFeature(Feature):
    details = ChecksDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(ClockTicked, SpotDueChecks(), expects=[
            Given(ClockTicked(agent=1), rows=[Check(n=1, title="Lint", data={"command": "make lint"}), AGENT_ROW]) >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[Check(n=1, title="Lint", data={"command": "make lint", "every": 5}), AGENT_ROW]) >> Dispatches(CheckDue(check=1)),
            Given(ClockTicked(agent=1), rows=[Check(n=1, title="Lint", data={"command": "make lint", "every": 5, "last": {"ok": True, "at": WHEN - 60}}), AGENT_ROW])
                >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(ClockTicked, ForgetDeadRuns(), expects=[
            Given(ClockTicked(agent=1), rows=[Check(n=1, title="Lint", data={"command": "make lint"}), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handle(CheckDue, StartDueCheck(), expects=[
            Given(CheckDue(check=1), rows=[Check(n=1, title="Review", data={"instruction": "Look at the board"}), AGENT_ROW]) >> Updated(Check(n=1), asked_at=WHEN),
        ])
        journal.events.listen(CheckUpdated, SpotCheckResult(), expects=[
            Given(RAN, rows=[lint(FAILING, ok=False), AGENT_ROW]) >> Dispatches(failed(FAILING, ())),
            Given(RAN, rows=[Check(n=1, title="Sins", data={"command": "checker", "failure": "The checker found {summary}",
                                                            "last": {"ok": False, "code": 1, "at": 5.0, "output": "3 sins across 1 skill."}})])
                >> Dispatches(CheckFailed(check=1, about="check:1", title="The checker found 3 sins across 1 skill.", headline="3 sins across 1 skill.",
                                          output="3 sins across 1 skill.", reported=digest("3 sins across 1 skill.", 12), stale=())),
            Given(RAN, rows=[lint(FAILING, ok=False), filed(FAILING), AGENT_ROW]) >> Dispatches(nothing),
            Given(RAN, rows=[lint("E999 syntax error", ok=False), filed(FAILING), AGENT_ROW]) >> Dispatches(failed("E999 syntax error", (3,))),
            Given(RAN, rows=[lint("all good", ok=True), Notification(n=3, title="check 1 failed", refs=["check:1"]), AGENT_ROW])
                >> Dispatches(CheckPassedAgain(check=1, about="check:1", notification=3)),
            Given(RAN, rows=[lint("all good", ok=True), AGENT_ROW]) >> Dispatches(nothing),
            Given(CheckUpdated(n=1, type="check", action="updated", actor=SYSTEM, ran=False), rows=[lint(FAILING, ok=False), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(CheckFailed, FileFailingCheck(), expects=[
            Given(failed(FAILING, ()), rows=[lint(FAILING, ok=False)]) >> Wrote(Notification(title=f"check 1 failed - {FAILING}", data={"label": "Check failed"})),
            Given(failed("E999 syntax error", (3,)), rows=[lint("E999 syntax error", ok=False), filed(FAILING)])
                >> Updated(Notification(n=3), outcome="the check reports something else now") & Wrote(Notification(title="check 1 failed - E999 syntax error")),
        ])
        journal.events.handle(CheckFailed, TellAgentOfFailingCheck(), expects=[
            Given(failed(FAILING, ()), rows=[lint(FAILING, ok=False), AGENT_ROW])
                >> Nudged("failed") & Updated(AgentRow(n=1), cards=[{"label": "Check 1 failed:", "name": FAILING, "row": "check:1", "side": "user"}]),
        ])
        journal.events.handle(CheckPassedAgain, SettlePassingCheck(), expects=[
            Given(CheckPassedAgain(check=1, about="check:1", notification=3), rows=[lint("all good", ok=True), filed(FAILING)])
                >> Updated(Notification(n=3), outcome="the check passes again"),
        ])
        journal.events.handle(CheckPassedAgain, MarkPassingCheck(), expects=[
            Given(CheckPassedAgain(check=1, about="check:1", notification=3), rows=[lint("all good", ok=True), AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"label": "Check 1 passes again", "row": "check:1", "side": "user"}]),
        ])
        journal.events.listen(AgentReported, SpotTestRuns(), expects=[
            Given(AgentReported(agent=1), rows=[AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(TestsRunning, ShowTestsRunning(), expects=[
            Given(TestsRunning(agent=1, key="tests:1.0", name="The whole suite", command="pytest", title="pytest", started=1.0), rows=[AGENT_ROW])
                >> Updated(AgentRow(n=1), cards=[{"key": "tests:1.0", "label": "Running tests", "icon": "check"}]),
        ])
        journal.events.handle(TestsFinished, ShowTestsFinished(), expects=[
            Given(TestsFinished(agent=1, key="tests:1.0", label="Tests passed", name="The whole suite", command="pytest", title="pytest", state="done", started=1.0, ended=2.0,
                                detail="3 passed"), rows=[AGENT_ROW]) >> Updated(AgentRow(n=1), cards=[{"key": "tests:1.0", "label": "Tests passed", "icon": "check"}]),
        ])
