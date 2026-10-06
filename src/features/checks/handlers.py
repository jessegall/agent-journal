import time
from dataclasses import dataclass
from typing import ClassVar

from engine.command_runs import CommandRun
from engine.events.engine import ClockTicked
from engine.events.agents import AgentReported
from engine.events.resources import ResourceEvent
from engine.wording import digest
from features.checks.output import summary
from providers.payload import HookEvent
from features.parts import AgentContext, Context, Handler
from features.checks.controller import Checks
from controllers.types import Agents, Notifications


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False


TESTS = "tests"


class RunDueChecks(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        checks = context.journal.get(Checks)
        for check in checks.due(time.time()):
            checks.in_background(check.n)


class ReportCheckResult(Handler):
    def handle(self, context: Context, event: CheckUpdated) -> None:
        if not event.ran:
            return
        check = context.journal.get(Checks).load(event.n)
        last = check.last_run
        output = last.output
        title = check.failure_title(summary(output) or check.title)
        filed = [row for row in context.journal.get(Notifications).linked_to(check.ref) if not row.completed]
        if last.ok:
            for stale in filed:
                context.journal.clear(stale, "the check passes again")
            return
        reported = digest(output, 12)
        if any(row.data.get("reported") == reported for row in filed):
            return
        for stale in filed:
            context.journal.clear(stale, "the check reports something else now")
        context.journal.notify("failing", title=title, output=output if output else "it said nothing", about=check.ref, reported=reported)
        speaking = context.to_primary()
        if speaking:
            speaking.agent.say("failed", title=title, n=check.n)


class MarkTestRuns(Handler):
    hooks = (HookEvent.PRE_TOOL_USE, HookEvent.POST_TOOL_USE)
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        run = CommandRun.from_json(row.running) if row.running else None
        if not run or run.effect != TESTS or not context.once("test_run", f"{run.at}|{run.done}"):
            return
        key = f"tests:{run.at}"
        if not run.done:
            context.journal.get(Agents).card(row.n, key=key, label="Running tests", icon="check", command=run.command, state="running", started=run.at)
            return
        result = run.result
        counts = ", ".join(part for part in (f"{result.passed} passed" if result and result.passed else "",
                                             f"{result.failed} failed" if result and result.failed else "") if part)
        failed = bool(result and (result.ok is False or result.failed))
        context.journal.get(Agents).card(row.n, key=key, label="Tests failed" if failed else "Tests passed", icon="check", command=run.command,
                                    state="failed" if failed else "done", started=run.at, ended=run.done, detail=counts)
