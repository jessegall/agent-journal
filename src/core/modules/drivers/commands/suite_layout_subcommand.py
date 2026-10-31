from argparse import ArgumentParser, Namespace

from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.suite_windows import SuiteWindows
from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.viewer.layout_shape import stored_layout
from core.modules.drivers.commands.support.page_layout import PageLayout
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.modules.environments.models.environment import Environment


class SuiteLayoutSubcommand(ReadSubcommand[PageLayout]):
    """`journal suite layout <environment> <page> [--driver <driver>]`: the default layout the environment's suite
    gives the page, its layout for the driver before its plain one."""

    cli_name = "suite"
    name = "layout"

    def __init__(self, choice: SuiteChoice, windows: SuiteWindows, queries: Queries) -> None:
        self.choice, self.windows, self.queries = choice, windows, queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("environment")
        parser.add_argument("page")
        parser.add_argument("--driver", default="")

    def read(self, arguments: Namespace, caller: Caller) -> PageLayout:
        environments = self.queries.query(Environment).filter(name=arguments.environment).page(1, 1).rows
        suite = self.choice.suite(environments[0].id) if environments else None
        if suite is None or not self.windows.has_layout(suite.name, arguments.page, arguments.driver):
            raise Refusal(f"no suite layout for the page {arguments.page} in {arguments.environment}", "the viewer then starts the page from its own default")
        return PageLayout(suite.name, arguments.page, arguments.driver, stored_layout(self.windows.layout(suite.name, arguments.page, arguments.driver)))
