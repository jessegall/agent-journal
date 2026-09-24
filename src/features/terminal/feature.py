from engine.events import CommandRan
from features.base import Feature
from features.journal import Journal
from features.parts import AgentContext, Handler
from features.terminal.details import TerminalDetails
from features.terminal.log import kept


class KeepCommands(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        kept(context.record, context.agent.row.title, event)


class Terminal(Feature):
    details = TerminalDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(KeepCommands())
