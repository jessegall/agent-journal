from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.aliases.commands.add_alias import AddAlias
from core.modules.aliases.models.alias import Alias


class AddAliasSubcommand(Subcommand[AddAlias, Alias]):
    """`journal alias add <name> "<line>" [--reader <name>] [--about <text>] [--env NAME=value ...]
    [--background] [--workers]`."""

    cli_name = "alias"
    name = "add"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("alias_name")
        parser.add_argument("line")
        parser.add_argument("--reader")
        parser.add_argument("--about", default="")
        parser.add_argument("--env", nargs="*", default=[])
        parser.add_argument("--background", action="store_true")
        parser.add_argument("--workers", action="store_true")

    def command(self, arguments: Namespace, caller: Caller) -> AddAlias:
        return AddAlias(arguments.alias_name, arguments.line, arguments.reader, arguments.about, tuple(arguments.env), arguments.background, arguments.workers)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Alias):
            output.line(f"alias {value.name} added: journal {value.name} [args] runs {value.line}")
