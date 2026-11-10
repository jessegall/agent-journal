from argparse import ArgumentParser, Namespace

from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.viewer.models.viewer_layout import ViewerLayout


class ViewerLayoutCurrentSubcommand(ReadSubcommand[ViewerLayout]):
    """`journal viewer-layout current --suite <suite> --page <page> [--driver <driver>]`: your saved layout of
    the page in your environment, or the one --environment names."""

    cli_name = "viewer-layout"
    name = "current"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--suite", required=True)
        parser.add_argument("--page", required=True)
        parser.add_argument("--driver", default="")

    def read(self, arguments: Namespace, caller: Caller) -> ViewerLayout:
        layout = self.queries.query(ViewerLayout).filter(person_id=caller.actor.id, suite=arguments.suite,
                                                       page=arguments.page, driver=arguments.driver).first()
        if layout is None:
            raise Refusal(f"you saved no layout of {arguments.page} for {arguments.suite}", "the viewer then shows the suite's layout")
        return layout
