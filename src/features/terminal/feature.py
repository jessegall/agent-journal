from features.base import Feature
from features.journal import Journal
from features.terminal.details import TerminalDetails
from features.terminal.handlers import KeepCommands
from features.terminal.routes import get_terminal


class Terminal(Feature):
    details = TerminalDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_terminal)
        journal.events.handler(KeepCommands())
