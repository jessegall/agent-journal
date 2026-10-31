from argparse import ArgumentParser, Namespace

from core.base.environment_names import EnvironmentNames
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.viewer.viewer_layout import ViewerLayout


class ViewerLayoutCurrentSubcommand(ReadSubcommand[ViewerLayout]):
    """`journal viewer-layout current --suite <suite> --page <page> [--driver <driver>]`: your saved layout of the
    page in your environment, or the one --environment names."""

    cli_name = "viewer-layout"
    name = "current"

    def __init__(self, queries: Queries, environment_names: EnvironmentNames) -> None:
        self.queries, self.environment_names = queries, environment_names

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--suite", required=True)
        parser.add_argument("--page", required=True)
        parser.add_argument("--driver", default="")
        parser.add_argument("--environment")

    def read(self, arguments: Namespace, caller: Caller) -> ViewerLayout:
        environment_id = self.environment_names.environment_id(arguments.environment) if arguments.environment else caller.environment_id
        rows = self.queries.query(ViewerLayout).filter(environment_id=environment_id, person_id=caller.actor.id, suite=arguments.suite,
                                                       page=arguments.page, driver=arguments.driver).page(1, 1).rows
        if not rows:
            raise Refusal(f"you saved no layout of {arguments.page} for {arguments.suite}", "the viewer then shows the suite's layout")
        return rows[0]
