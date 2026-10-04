import time
from dataclasses import dataclass
from typing import ClassVar

from engine.command_runs import CommandRun
from engine.events.agents import AgentReported
from engine.events.resources import ResourceEvent
from features.checks.output import summary
from features.parts import AgentContext, Context, Handler


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False


TESTS = "tests"


class RunDueChecks(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        checks = context.journal.checks
        for check in checks._due(time.time()):
            checks._in_background(check.n)


class ReportCheckResult(Handler):
    def handle(self, context: Context, event: CheckUpdated) -> None:
        if not event.ran:
            return
        check = context.journal.checks.load(event.n)
        last = check.last_run
        output = last.output
        title = check.failure_title(summary(output) or check.title)
        if last.ok:
            for stale in context.journal.notifications.linked_to(check.ref):
                if not stale.completed:
                    context.journal.clear(stale, "the check passes again")
            return
        context.journal.notify("failing", title=title, output=output if output else "it said nothing", about=check.ref)
        speaking = context.to_primary()
        if speaking:
            speaking.agent.say("failed", title=title, n=check.n)


class MarkTestRuns(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        run = CommandRun.from_json(row.running) if row.running else None
        if not run or run.effect != TESTS or not context.once("test_run", f"{run.at}|{run.done}"):
            return
        key = f"tests:{run.at}"
        if not run.done:
            context.journal.agents.card(row.n, key=key, label="Running tests", icon="check", command=run.command, state="running", started=run.at)
            return
        result = run.result
        counts = ", ".join(part for part in (f"{result.passed} passed" if result and result.passed else "",
                                             f"{result.failed} failed" if result and result.failed else "") if part)
        failed = bool(result and (result.ok is False or result.failed))
        context.journal.agents.card(row.n, key=key, label="Tests failed" if failed else "Tests passed", icon="check", command=run.command,
                                    state="failed" if failed else "done", started=run.at, ended=run.done, detail=counts)
