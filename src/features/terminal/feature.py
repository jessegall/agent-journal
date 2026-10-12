from events.agents import CommandRan
from expects import Given, Unchanged
from resources.types import AgentRow
from framework.base import Feature
from framework.journal import Journal
from features.terminal.details import TerminalDetails
from features.terminal.handlers import KeepCommands
from features.terminal.routes import get_terminal


class Terminal(Feature):
    details = TerminalDetails

    def register(self, journal: Journal) -> None:
        journal.routes.add(get_terminal)
        journal.events.handler(KeepCommands(), expects=[
            Given(CommandRan(agent=1, tool="Bash", command="ls", output="a.txt"), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
        ])
