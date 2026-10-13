from pathlib import Path

from engine.command_runs import CommandRun, command_runs
from events import Fact
from events.agents import AgentReported, ClockTicked
from events.checks import CheckDue, CheckFailed, CheckPassedAgain, CheckUpdated, TestsFinished, TestsRunning
from framework.command_effects import background_outcome
from framework.tested import testing_piece, tested
from payload import HookEvent
from receiving import Listener
from resources.check_output import summary
from resources.checks import Check
from resources.text import digest
from resources.types import AgentRow, Notification
from serving import Clock, Providers, ReadRows

TESTS = "tests"
TOOL_HOOKS = (HookEvent.PRE_TOOL_USE, HookEvent.POST_TOOL_USE)


def verdict(result, failed: bool) -> str:
    if failed:
        return "Tests failed"
    return "Tests passed" if result else "Tests ran"


def finished(agent: int, run: CommandRun, result, ended: float) -> TestsFinished:
    ran = tested(run.command)
    counts = ", ".join(part for part in (f"{result.passed} passed" if result and result.passed else "",
                                         f"{result.failed} failed" if result and result.failed else "") if part)
    failed = bool(result and (result.ok is False or result.failed))
    return TestsFinished(agent=agent, key=f"tests:{run.at}", label=verdict(result, failed), name=ran.name, command=ran.command, title=run.command,
                         state="failed" if failed else "done", started=run.at, ended=ended, detail=counts)


class SpotDueChecks(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, checks: ReadRows[Check], clock: Clock) -> list[Fact]:
        return [CheckDue(check=check.n) for check in checks.due(clock.now())]


class SpotCheckResult(Listener[CheckUpdated]):
    def listen(self, event: CheckUpdated, checks: ReadRows[Check], notifications: ReadRows[Notification]) -> list[Fact]:
        if not event.ran:
            return []
        check = checks.peek(event.n)
        last = check.last_run
        filed = [row for row in notifications.linked_to(check.ref) if not row.completed]
        if last.ok:
            return [CheckPassedAgain(check=check.n, about=check.ref, notification=row.n) for row in filed]
        reported = digest(last.output, 12)
        if any(row.data.get("reported") == reported for row in filed):
            return []
        headline = summary(last.output) or check.title
        return [CheckFailed(check=check.n, about=check.ref, title=check.failure_title(headline), headline=headline, output=last.output or "it said nothing",
                            reported=reported, stale=tuple(row.n for row in filed))]


class SpotTestRuns(Listener[AgentReported]):
    def listen(self, event: AgentReported, agents: ReadRows[AgentRow], providers: Providers) -> list[Fact]:
        if event.hook not in TOOL_HOOKS:
            return []
        row = agents.peek(event.agent)
        return [*self.ended_in_background(row, providers), *self.in_foreground(row)]

    def in_foreground(self, row: AgentRow) -> list[Fact]:
        run = CommandRun.from_json(row.running) if row.running else None
        if not run or run.effect != TESTS or not testing_piece(run.command):
            return []
        claim = f"{run.at}|{run.done}"
        if run.done and not run.background:
            return [finished(row.n, run, run.result, run.done).once(claim)]
        ran = tested(run.command)
        return [TestsRunning(agent=row.n, key=f"tests:{run.at}", name=ran.name, command=ran.command, title=run.command, started=run.at).once(claim)]

    def ended_in_background(self, row: AgentRow, providers: Providers) -> list[Fact]:
        reader = providers.reader(row)
        if reader is None:
            return []
        tasks = reader.background_tasks(Path(row.transcript))
        facts = []
        for task, command in tasks.commands.items():
            piece = " ".join(testing_piece(command))
            if not piece or task not in tasks.ended:
                continue
            run = next((one for one in reversed(command_runs(row)) if one.effect == TESTS and one.command == piece), None)
            if run is None:
                continue
            outcome = background_outcome(command, row.cwd, tasks.outputs.get(task, ""), "failed" if task in tasks.failed else "completed")
            facts.append(finished(row.n, run, outcome, tasks.ended[task]).once(f"background|{task}"))
        return facts
