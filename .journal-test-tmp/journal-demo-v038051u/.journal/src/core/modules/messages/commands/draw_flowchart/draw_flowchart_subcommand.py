from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.messages.commands.draw_flowchart.draw_flowchart import DrawFlowchart
from core.modules.messages.models.message import Message


class DrawFlowchartSubcommand(Subcommand[DrawFlowchart, Message]):
    """`journal message flowchart "<title>" --edge "From -> To: label"`: draws a flowchart in the chat, which
    opens large in a dialog."""

    cli_name = "message"
    name = "flowchart"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--edge", action="append", default=[], dest="edges")

    def command(self, arguments: Namespace, caller: Caller) -> DrawFlowchart:
        return DrawFlowchart(arguments.title, tuple(arguments.edges))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.line(f"flowchart {value.id} drawn")
