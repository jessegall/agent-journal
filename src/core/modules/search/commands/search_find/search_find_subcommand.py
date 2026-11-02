from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.search.support.row_search import RowSearch
from core.modules.search.support.search_result import SearchResult


class SearchFindSubcommand(ReadSubcommand[SearchResult]):
    """`journal search find <terms> [--model task,doc]`: the newest rows that hold every term, each with a
    short passage around the first."""

    cli_name = "search"
    name = "find"

    def __init__(self, search: RowSearch) -> None:
        self.search = search

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("terms", nargs="+")
        parser.add_argument("--model", default="")

    def read(self, arguments: Namespace, caller: Caller) -> SearchResult:
        return self.search.result(arguments.terms, [name for name in arguments.model.split(",") if name])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SearchResult):
            output.write("\n".join(value.lines()), {"hits": [{"cli_name": hit.cli_name, "id": hit.row_id, "passage": hit.passage} for hit in value.hits], "total": value.total})
