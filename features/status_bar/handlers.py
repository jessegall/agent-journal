import time

from engine.events import AgentReported
from features.parts import AgentContext, Handler
from features.status_bar.bar import EMPTY, bar
from features.status_bar.usage import observe


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
