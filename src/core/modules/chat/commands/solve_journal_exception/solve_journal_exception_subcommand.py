from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.chat.commands.solve_journal_exception.solve_journal_exception import SolveJournalException
from core.modules.chat.models.journal_exception import JournalException


class SolveJournalExceptionSubcommand(Subcommand[SolveJournalException, JournalException]):
    """`journal journal-exception solve <id>`: marks a recorded error solved, which clears it from the list."""

    cli_name = "journal-exception"
    name = "solve"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("row_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> SolveJournalException:
        return SolveJournalException(arguments.row_id)
