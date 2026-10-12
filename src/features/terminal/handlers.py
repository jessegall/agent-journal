from events.agents import CommandRan
from framework.parts import AgentContext, Handler
from features.terminal.log import kept


class KeepCommands(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        kept(context.record, context.agent.row.title, event)
