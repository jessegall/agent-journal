from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.aliases.commands.edit_alias import EditAlias
from core.modules.aliases.models.alias import Alias


class EditAliasSubcommand(Subcommand[EditAlias, Alias]):
    """`journal alias edit <name> [--line "<line>"] [--reader <name>] [--about <text>] [--background |
    --foreground]`."""

    cli_name = "alias"
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("alias_name")
        parser.add_argument("--line")
        parser.add_argument("--reader")
        parser.add_argument("--about")
        running = parser.add_mutually_exclusive_group()
        running.add_argument("--background", dest="background", action="store_true", default=None)
        running.add_argument("--foreground", dest="background", action="store_false")

    def command(self, arguments: Namespace, caller: Caller) -> EditAlias:
        return EditAlias(arguments.alias_name, arguments.line, arguments.reader, arguments.about, arguments.background)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Alias):
            output.line(f"alias {value.name} changed")
