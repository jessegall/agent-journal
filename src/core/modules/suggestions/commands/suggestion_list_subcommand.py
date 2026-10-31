from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.suggestions.models.suggestion import Suggestion


class SuggestionListSubcommand(ReadSubcommand[Sequence[Suggestion]]):
    """`journal suggestion list [--open]`: every suggestion with its answer, or only those still waiting."""

    cli_name = "suggestion"
    name = "list"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--open", action="store_true")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Suggestion]:
        query = self.queries.query(Suggestion).oldest()
        return tuple((query.matching(IsNull("answer")) if arguments.open else query).all_rows())

    def write_output(self, value: object, output: Output) -> None:
        listed = [row for row in value if isinstance(row, Suggestion)] if is_tuple(value) else []
        output.write("\n".join(f"{row.id:>4}  {row.title}  {row.answer or 'waiting'}" for row in listed), {"rows": [output.values(row) for row in listed]})
