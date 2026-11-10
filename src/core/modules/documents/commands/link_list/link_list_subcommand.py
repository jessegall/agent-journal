from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.agent_number import AGENT_MODEL_NAME, AgentNumber
from engine.cli.row_numbers import RowNumbers
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.support.link_page import LinkPage
from core.modules.documents.support.link_pages import LinkPages


class LinkListSubcommand(ReadSubcommand[LinkPage]):
    """Reads bounded relation pages or distinct counterparts with their matching relation labels."""

    cli_name = "link"
    name = "list"

    def __init__(self, pages: LinkPages, numbers: RowNumbers) -> None:
        self.pages, self.numbers = pages, numbers

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
        for end in ("source", "target", "row"):
            setattr(arguments, end, self.row_reference(getattr(arguments, end), caller.environment_id))
        return self.pages.read(arguments)

    def row_reference(self, reference: str | None, environment_id: int | None) -> str | None:
        model_name, _, number = (reference or "").partition(":")
        if model_name != AGENT_MODEL_NAME or not number.isdigit():
            return reference
        return f"{model_name}:{self.numbers.row_id(model_name, int(AgentNumber(number)), environment_id)}"

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LinkPage):
            output.write("\n".join(self.pages.lines(value)), self.pages.payload(value, output))
