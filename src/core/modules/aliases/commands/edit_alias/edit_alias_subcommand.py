from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.driver.command_category import CommandCategory
from engine.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.aliases.commands.edit_alias.edit_alias import EditAlias
from core.modules.aliases.models.alias import Alias


class EditAliasSubcommand(Subcommand[EditAlias, Alias]):
    """`journal alias edit <name> [--line "<line>"] [--reader <name>] [--about <text>] [--category "test run"]
    [--background | --foreground]`."""

    cli_name = "alias"
    name = "edit"
    outward = True

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("alias_name")
        parser.add_argument("--line")
        parser.add_argument("--reader")
        parser.add_argument("--about")
        parser.add_argument("--category", choices=[category.value for category in CommandCategory])
        running =parser.add_mutually_exclusive_group()
        running.add_argument("--background", dest="background", action="store_true", default=None)
        running.add_argument("--foreground", dest="background", action="store_false")
        access = parser.add_mutually_exclusive_group()
        access.add_argument(*(f"--{name}" for name in self.registry.alias_permission_names), dest="agent_access", action="store_true", default=None)
        access.add_argument("--main-only", dest="agent_access", action="store_false")

    def command(self, arguments: Namespace, caller: Caller) -> EditAlias:
        category = CommandCategory(arguments.category) if arguments.category else None
        return EditAlias(arguments.alias_name, arguments.line, arguments.reader, arguments.about, arguments.background, arguments.agent_access, category)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Alias):
            output.line(f"alias {value.name} changed")
