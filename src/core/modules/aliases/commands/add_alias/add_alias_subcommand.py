from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.driver.command_category import CommandCategory
from engine.registry.registry import Registry
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.aliases.commands.add_alias.add_alias import AddAlias
from core.modules.aliases.models.alias import Alias


class AddAliasSubcommand(Subcommand[AddAlias, Alias]):
    """`journal alias add <name> "<line>" [--reader <name>] [--about <text>] [--env NAME=value ...]
    [--background] [--agents] [--category "test run"]`."""

    cli_name = "alias"
    name = "add"
    outward = True

    def __init__(self, registry: Registry) -> None:
        self.registry = registry

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("alias_name")
        parser.add_argument("line")
        parser.add_argument("--reader")
        parser.add_argument("--about", default="")
        parser.add_argument("--env", nargs="*", default=[])
        parser.add_argument("--background", action="store_true")
        parser.add_argument(*(f"--{name}" for name in self.registry.alias_permission_names), dest="agents", action="store_true")
        parser.add_argument("--category", choices=[category.value for category in CommandCategory])

    def command(self, arguments: Namespace, caller: Caller) -> AddAlias:
        return AddAlias(arguments.alias_name, arguments.line, arguments.reader, arguments.about, tuple(arguments.env), arguments.background, arguments.agents,
                        CommandCategory(arguments.category) if arguments.category else None)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Alias):
            output.line(f"alias {value.name} added: journal {value.name} [args] runs {value.line}")
