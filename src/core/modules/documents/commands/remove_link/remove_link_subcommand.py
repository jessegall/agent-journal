from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.remove_link.remove_link import RemoveLink


class RemoveLinkSubcommand(Subcommand[RemoveLink, None]):
    """Removes an authorized about or edited request attribution."""

    cli_name = "link"
    name = "remove"
    help = "Remove an about or edited attribution. Other relations stay; explicit work-from permits later attribution."

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("link_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> RemoveLink:
        return RemoveLink(arguments.link_id)

    def write_output(self, value: object, output: Output) -> None:
        output.line("attribution removed; other relations kept")
