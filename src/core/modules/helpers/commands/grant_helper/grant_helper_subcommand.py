from engine.cli.agent_id import AgentId
from argparse import REMAINDER, ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from core.modules.helpers.commands.grant_helper.grant_helper import GrantHelper
from core.modules.helpers.models.helper_grant import ALTERNATIVE_SEPARATOR, HelperGrant


class GrantHelperSubcommand(Subcommand[GrantHelper, HelperGrant]):
    """`journal helper grant <n> <program> <subcommands> [<arguments and values>]`, alternatives split by a bar. The
    allowed words may come one by one or as one bar-split word, and a program quoted with its words is split into
    them, so a grant is kept the same way however the line was written."""

    cli_name = "helper"
    name = "grant"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("helper_id", type=AgentId)
        parser.add_argument("program")
        parser.add_argument("subcommands")
        parser.add_argument("allowed_arguments", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> GrantHelper:
        words = [*arguments.program.split(), arguments.subcommands, *arguments.allowed_arguments]
        allowed = (part for word in words[2:] for part in word.split(ALTERNATIVE_SEPARATOR) if part)
        return GrantHelper(arguments.helper_id, words[0], words[1], ALTERNATIVE_SEPARATOR.join(allowed))
