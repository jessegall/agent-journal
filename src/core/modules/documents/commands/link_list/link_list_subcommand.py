from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.support.link_page import LinkPage
from core.modules.documents.support.link_pages import LinkPages


class LinkListSubcommand(ReadSubcommand[LinkPage]):
    """Reads bounded relation pages or distinct counterparts with their matching relation labels."""

    cli_name = "link"
    name = "list"

    def __init__(self, pages: LinkPages) -> None:
        self.pages = pages

    def arguments(self, parser: ArgumentParser) -> None:
        ends = parser.add_mutually_exclusive_group(required=True)
        ends.add_argument("--source")
        ends.add_argument("--target")
        ends.add_argument("--row")
        parser.add_argument("--page", type=int, default=1)
        parser.add_argument("--page-size", type=int, default=25)
        parser.add_argument("--type", type=LinkType, choices=tuple(LinkType), action="append", default=[])
        parser.add_argument("--group-counterparts", action="store_true")
        parser.add_argument("--first-counterpart")
        parser.add_argument("--outside-plan", dest="excludes_plan", action="store_true")
        parser.add_argument("--kind", dest="target_model")

    def read(self, arguments: Namespace, caller: Caller) -> LinkPage:
        return self.pages.read(arguments)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LinkPage):
            output.write("\n".join(self.pages.lines(value)), self.pages.payload(value, output))
