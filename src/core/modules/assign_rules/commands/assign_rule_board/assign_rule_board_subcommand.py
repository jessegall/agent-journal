from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.assign_rules.support.board.assign_board import AssignBoard
from core.modules.assign_rules.support.board.assign_board_reader import AssignBoardReader


class AssignRuleBoardSubcommand(ReadSubcommand[AssignBoard]):
    """`journal assign-rule board`: the targets and rules of the environment as the Assign tab shows them,
    with the revision a change names."""

    cli_name = "assign-rule"
    name = "board"

    def __init__(self, reader: AssignBoardReader) -> None:
        self.reader = reader

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> AssignBoard:
        return self.reader.read()
