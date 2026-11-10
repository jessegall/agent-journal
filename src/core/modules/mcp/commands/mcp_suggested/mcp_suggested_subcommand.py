from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.types.type_guards import is_tuple
from core.modules.mcp.support.server_catalogue import ServerCatalogue
from core.modules.mcp.support.server_suggestion import ServerSuggestion


class McpSuggestedSubcommand(ReadSubcommand[Sequence[ServerSuggestion]]):
    """`journal mcp suggested`: the servers worth adding, with what each is for and how it is let in."""

    cli_name = "mcp"
    name = "suggested"

    def __init__(self, catalogue: ServerCatalogue) -> None:
        self.catalogue = catalogue

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[ServerSuggestion]:
        return self.catalogue.all()

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, ServerSuggestion)] if is_tuple(value) else []
        output.write("\n".join(f"{row.name}  {row.title}: {row.subject}{row.admission}" for row in listed), {"rows": [output.values(row) for row in listed]})
