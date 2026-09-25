import time

from engine.events import AgentReported
from features.parts import AgentContext, Handler
from features.status_bar.bar import EMPTY, bar
from features.status_bar.runs import CommandRun
from features.status_bar.usage import observe


TESTS = "tests"


class WriteBar(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        newest = context.journal.agents.primary()
        context.record.state("status_bar").set("bar", bar(newest, time.time()) if newest else EMPTY)


class RefreshUsage(Handler):
    behaviour = "usage"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        usage = observe(row.provider, row.transcript, row.usage)
        if usage is not None and usage != row.usage:
            context.journal.agents.update(row.n, usage=usage)


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
