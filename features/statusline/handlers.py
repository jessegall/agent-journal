import time

from engine.events import AgentUpdated
from engine.stored import write_json
from features.parts import Context, Handler
from features.statusline.bar import EMPTY, bar, bar_file
from features.statusline.usage import observe


class WriteBar(Handler):
    def handle(self, context: Context, event: AgentUpdated) -> None:
        newest = context.journal.agents.primary()
        write_json(bar_file(context.record.root, context.record.env), bar(newest, time.time()) if newest else EMPTY)


class RefreshUsage(Handler):
    behaviour = "usage"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        if not context.agent:
            return
        row = context.agent.row
        usage = observe(row.provider, row.transcript, row.usage)
        if usage is not None and usage != row.usage:
            context.journal.agents.update(row.n, usage=usage)
