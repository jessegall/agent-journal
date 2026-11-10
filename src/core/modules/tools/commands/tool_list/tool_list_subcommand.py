from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.tools.support.tool_cards import ToolCards
from core.modules.tools.support.tools import Tools


class ToolListSubcommand(ReadSubcommand[ToolCards]):
    """`journal tool list`: each supported tool, whether it is installed and on, and its last refresh."""

    cli_name = "tool"
    name = "list"

    def __init__(self, tools: Tools) -> None:
        self.tools = tools

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> ToolCards:
        return ToolCards(self.tools.cards())
