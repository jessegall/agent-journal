from engine.events.engine import CommandRan
from features.base import Feature
from features.journal import Journal
from features.parts import AgentContext, Handler
from features.terminal.details import TerminalDetails
from features.terminal.log import kept
from features.terminal.routes import get_terminal


class KeepCommands(Handler):
    def handle(self, context: AgentContext, event: CommandRan) -> None:
        kept(context.record, context.agent.row.title, event)


class Terminal(Feature):
    details = TerminalDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_terminal)
        journal.events.handler(KeepCommands())
