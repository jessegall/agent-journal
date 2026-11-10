from argparse import ArgumentParser, Namespace
from dataclasses import replace

from engine.caller.caller import Caller
from core.base.library.library_lookup import LibraryLookup
from core.base.registry.registry import Registry
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.search.support.row_search import RowSearch
from core.modules.search.support.search_outcomes import SearchOutcomes
from core.modules.search.support.search_result import SearchResult


class SearchFindSubcommand(ReadSubcommand[SearchResult]):
    """`journal search find <terms> [--model task,doc]`: the newest rows that hold every term, each with a
    short excerpt around the first."""

    cli_name = "search"
    name = "find"

    def __init__(self, search: RowSearch, lookup: LibraryLookup, registry: Registry, outcomes: SearchOutcomes) -> None:
        self.search, self.lookup, self.registry, self.outcomes = search, lookup, registry, outcomes

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("terms", nargs="+")
        parser.add_argument("--model", default="")
        parser.add_argument("--split-terms", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> SearchResult:
        wanted = [model for model in arguments.model.split(",") if model]
        terms = [word for term in arguments.terms for word in term.split()] if arguments.split_terms else arguments.terms
        kept = self.outcomes.read_once(caller.actor.id, terms, wanted)
        local = kept if kept is not None else self.search.result(terms, wanted)
        shares = [share for share in self.registry.library_shares if not wanted or share in wanted]
        return replace(local, library=self.lookup.hits(terms, shares)) if shares else local

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, SearchResult):
            output.write("\n".join(value.lines()), value.json())
