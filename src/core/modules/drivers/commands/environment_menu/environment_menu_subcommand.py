from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.drivers.commands.support.environment_menu import EnvironmentMenu
from core.modules.drivers.commands.support.environment_menu_choice import EnvironmentMenuChoice
from core.modules.drivers.models.environment_menu_row import EnvironmentMenuRow
from core.modules.drivers.support.suite_choice import SuiteChoice

MENU_REASON = "The menu names every environment of the project, a catalogue a person makes by hand."


class EnvironmentMenuSubcommand(ReadSubcommand[EnvironmentMenu]):
    """`journal environment menu`: every environment with its suite and whether a main agent runs in it, oldest
    first."""

    cli_name = "environment"
    name = "menu"
    disabled_scopes = [EnvironmentScope]

    def __init__(self, queries: Queries, suites: SuiteChoice) -> None:
        self.queries, self.suites = queries, suites

    def arguments(self, parser: ArgumentParser) -> None:
        pass

    def read(self, arguments: Namespace, caller: Caller) -> EnvironmentMenu:
        rows = self.queries.query(EnvironmentMenuRow).every_row(MENU_REASON)
        return EnvironmentMenu(tuple(EnvironmentMenuChoice(row, self.suites.suite_name(row.suite_setting)) for row in rows))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, EnvironmentMenu):
            output.write(value.lines(), value.json())
