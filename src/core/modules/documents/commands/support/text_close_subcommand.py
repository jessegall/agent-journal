from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.close_text import CloseText
from core.modules.documents.models.text_row import TextRow


class TextCloseSubcommand(Subcommand[CloseText, TextRow]):
    """`journal <doc or report> close <n> --why "<reason>"`: closes it as needing no action."""

    model: ClassVar[type[TextRow]]
    name = "close"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--why", required=True)

    def command(self, arguments: Namespace, caller: Caller) -> CloseText:
        return CloseText(self.model, arguments.id, arguments.why)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TextRow):
            output.line(f"{value.cli_name} {value.id} closed: {value.close_reason}")
