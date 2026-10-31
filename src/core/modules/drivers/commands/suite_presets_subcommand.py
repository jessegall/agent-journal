from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.page import Page
from core.base.query.queries import Queries
from core.base.registry.suite_windows import SuiteWindows
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.layout_shape import stored_layout
from core.modules.drivers.commands.support.page_preset import PagePreset
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.environments.models.environment import Environment


class SuitePresetsSubcommand(ReadSubcommand[Page[PagePreset]]):
    """`journal suite presets <environment> <page>`: the layouts the environment's suite offers for the page, in the
    order it declares them, then those of the suites it requires."""

    cli_name = "suite"
    name = "presets"

    def __init__(self, choice: SuiteChoice, windows: SuiteWindows, queries: Queries) -> None:
        self.choice, self.windows, self.queries = choice, windows, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("environment")
        parser.add_argument("page")

    def read(self, arguments: Namespace, caller: Caller) -> Page[PagePreset]:
        environments = self.queries.query(Environment).filter(name=arguments.environment).page(1, 1).rows
        suite = self.choice.suite(environments[0].id) if environments else None
        presets = self.windows.presets(suite.name, arguments.page) if suite is not None else []
        rows = tuple(PagePreset(preset.key, preset.name, preset.text, stored_layout(preset.shape)) for preset in presets)
        return Page(rows, 1, max(len(rows), 1), len(rows))
