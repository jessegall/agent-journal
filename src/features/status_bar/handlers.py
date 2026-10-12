import time

from engine import bus
from events.agents import AgentReported
from features.parts import AgentContext, Handler
from features.status_bar.bar import EMPTY, bar, doing
from features.status_bar.usage import observe
from controllers.types import Agents

BAR_EVERY = 1.0


class WriteBar(Handler):
    """A person reads the bar about once a second, so it is written at most that often, the latest state winning."""

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        bus.spaced(f"bar {context.record.home}", BAR_EVERY, lambda: self.write(context))

    def write(self, context: AgentContext) -> None:
        newest = context.journal.get(Agents).primary_to_read()
        drawn = bar(newest, time.time()) if newest else EMPTY
        state = context.record.state("status_bar")
        if state.get("bar") != drawn:
            state.set("bar", drawn)


class RecordWhatItDoes(Handler):
    """The agent's own row keeps the bar's plain line for its latest activity, which the Home cells show in place of a tool name."""

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        bus.spaced(f"doing {context.record.home} {row.n}", BAR_EVERY, lambda: self.record(context, row))

    def record(self, context: AgentContext, row) -> None:
        line = doing(row, time.time())
        if line != row.doing:
            context.journal.get(Agents).update(row.n, doing=line)


class RefreshUsage(Handler):
    behaviour = "usage"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        usage = observe(row.provider, row.transcript, row.usage)
        if usage is not None and usage != row.usage:
            context.journal.get(Agents).update(row.n, usage=usage)
