from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.aliases.commands.remove_alias.remove_alias import RemoveAlias


class RemoveAliasSubcommand(Subcommand[RemoveAlias, str]):
    """`journal alias remove <name>`."""

    cli_name = "alias"
    name = "remove"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("alias_name")

    def command(self, arguments: Namespace, caller: Caller) -> RemoveAlias:
        return RemoveAlias(arguments.alias_name)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"alias {value} removed")
