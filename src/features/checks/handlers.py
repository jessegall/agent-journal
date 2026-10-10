import time
from dataclasses import dataclass
from typing import ClassVar

from pathlib import Path

from engine.command_runs import CommandRun, command_runs
from engine.events.engine import ClockTicked
from engine.events.agents import AgentReported
from engine.events.resources import ResourceEvent
from engine.wording import digest
from features.checks.output import summary
from providers.payload import HookEvent
from providers import transcript_reader
from providers.command_effects import background_outcome
from providers.tested import testing_piece, tested
from features.parts import AgentContext, Context, Handler
from features.checks.controller import Checks
from controllers.types import Agents, Notifications
from resources.base import SYSTEM, USER


@dataclass(frozen=True)
class CheckUpdated(ResourceEvent):
    on: ClassVar[str] = "check.updated"
    ran: bool = False


TESTS = "tests"


class RunDueChecks(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        checks = context.journal.get(Checks)
        for check in checks.due(time.time()):
            checks.begin(check.n)


class ReportCheckResult(Handler):
    def handle(self, context: Context, event: CheckUpdated) -> None:
        if not event.ran:
            return
        check = context.journal.get(Checks).load(event.n)
        last = check.last_run
        output = last.output
        headline = summary(output) or check.title
        title = check.failure_title(headline)
        filed = [row for row in context.journal.get(Notifications).linked_to(check.ref) if not row.completed]
        if last.ok:
            for stale in filed:
                context.journal.clear(stale, "the check passes again")
                self.mark(context, check, f"Check {check.n} passes again", tone="good", key=f"check:{check.n}:cleared:{stale.n}")
            return
        reported = digest(output, 12)
        if any(row.data.get("reported") == reported for row in filed):
            return
        for stale in filed:
            context.journal.clear(stale, "the check reports something else now")
        context.journal.notify("failing", title=title, output=output if output else "it said nothing", about=check.ref, reported=reported)
        self.mark(context, check, f"Check {check.n} failed:", name=headline, tone="danger", key=f"check:{check.n}:{reported}")
        speaking = context.to_primary()
        if speaking:
            speaking.agent.say("failed", title=title, n=check.n)


    def mark(self, context: Context, check, label: str, **card) -> None:
        """Shows the check's state in the chat on your side, addressed to the agent, and opening the check."""
        agents = Agents(context.record, actor=SYSTEM)
        row = agents.primary()
        if row:
            agents.card(row.n, label=label, icon="check", side=USER, row=check.ref, **card)


def verdict(result, failed: bool) -> str:
    if failed:
        return "Tests failed"
    return "Tests passed" if result else "Tests ran"


class MarkTestRuns(Handler):
    hooks = (HookEvent.PRE_TOOL_USE, HookEvent.POST_TOOL_USE)

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        self.finish_background(context)
        row = context.agent.row
        run = CommandRun.from_json(row.running) if row.running else None
        if not run or run.effect != TESTS or not testing_piece(run.command) or not context.once("test_run", f"{run.at}|{run.done}"):
            return
        ran = tested(run.command)
        if not run.done or run.background:
            context.journal.get(Agents).card(row.n, key=f"tests:{run.at}", label="Running tests", icon="check", name=ran.name, command=ran.command, title=run.command,
                                             state="running", started=run.at)
            return
        self.finish(context, run, run.result, run.done)

    def finish_background(self, context: AgentContext) -> None:
        row = context.agent.row
        reader = transcript_reader(row)
        if reader is None:
            return
        tasks = reader.background_tasks(Path(row.transcript))
        for task, command in tasks.commands.items():
            piece = " ".join(testing_piece(command))
            if not piece or task not in tasks.ended:
                continue
            run = next((one for one in reversed(command_runs(row)) if one.effect == TESTS and one.command == piece), None)
            if run is None or not context.once("test_run", f"background|{task}"):
                continue
            outcome = background_outcome(command, row.cwd, tasks.outputs.get(task, ""), "failed" if task in tasks.failed else "completed")
            self.finish(context, run, outcome, tasks.ended[task])

    def finish(self, context: AgentContext, run: CommandRun, result, ended: float) -> None:
        ran = tested(run.command)
        counts = ", ".join(part for part in (f"{result.passed} passed" if result and result.passed else "",
                                             f"{result.failed} failed" if result and result.failed else "") if part)
        failed = bool(result and (result.ok is False or result.failed))
        context.journal.get(Agents).card(context.agent.row.n, key=f"tests:{run.at}", label=verdict(result, failed), icon="check", name=ran.name, command=ran.command,
                                         title=run.command, state="failed" if failed else "done", started=run.at, ended=ended, detail=counts)
