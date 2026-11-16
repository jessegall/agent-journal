from argparse import Namespace

from engine.caller.caller import Caller
from engine.row.page import Page
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.viewer.settings_section import SettingsSection
from core.modules.drivers.support.suite_choice import SuiteChoice


class SuiteSectionsSubcommand(ReadSubcommand[Page[SettingsSection]]):
    """`journal suite sections`: the sections the environment's suite adds to the Settings page, in the order it
    declares them; none when the environment runs no suite."""

    cli_name = "suite"
    name = "sections"

    def __init__(self, choice: SuiteChoice) -> None:
        self.choice = choice

    def read(self, arguments: Namespace, caller: Caller) -> Page[SettingsSection]:
        suite = self.choice.suite()
        rows = tuple(suite.settings_sections) if suite is not None else ()
        return Page(rows, 1, max(len(rows), 1), len(rows))
