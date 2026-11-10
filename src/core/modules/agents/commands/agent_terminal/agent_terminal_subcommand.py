from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.journal.journal_home import JournalHome
from engine.provider.transcript_tail import TranscriptTail
from engine.query.queries import Queries
from engine.row.page import Page
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.agents.commands.support.terminal_line import TerminalLine
from core.modules.agents.models.agent import Agent

TERMINAL_LIMIT_LINES = 2000
SEPARATOR = "\t"


class AgentTerminalSubcommand(ReadSubcommand[Page[TerminalLine]]):
    """`journal agent terminal <agent> [--after <line>]`: what the agent program printed in its terminal,
    from the launcher's log, the lines after the one named."""

    cli_name = "agent"
    name = "terminal"

    def __init__(self, home: JournalHome, queries: Queries) -> None:
        self.home, self.queries = home, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("agent_id", type=int)
        parser.add_argument("--after", type=int, default=0, help="the number of the last line already read")

    def read(self, arguments: Namespace, caller: Caller) -> Page[TerminalLine]:
        path = self.home.terminal_file(self.queries.query(Agent).find(arguments.agent_id).terminal_id)
        logged = TranscriptTail(path).lines(TERMINAL_LIMIT_LINES)
        lines = [TerminalLine(int(number), text) for number, _, text in (line.partition(SEPARATOR) for line in logged) if number.isdigit()]
        newer = [line for line in lines if line.number > arguments.after][-TERMINAL_LIMIT_LINES:]
        return Page(tuple(newer), 1, max(len(newer), 1), len(newer))
