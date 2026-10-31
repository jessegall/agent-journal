from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.documents.models.link import Link
from core.modules.documents.support.row_refs import RowRefs


class LinkListSubcommand(ReadSubcommand[Sequence[Link]]):
    """`journal link list --source <model or table:n>`: the links from a row, each with what it means and
    where it leads."""

    cli_name = "link"
    name = "list"

    def __init__(self, queries: Queries, row_refs: RowRefs) -> None:
        self.queries, self.row_refs = queries, row_refs

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--source", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Link]:
        source = self.row_refs.parsed(arguments.source)
        return tuple(self.queries.query(Link).filter(source_model=source.model, source_id=source.row_id).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        links = [row for row in value if isinstance(row, Link)] if is_tuple(value) else []
        output.write("\n".join(f"{row.source_model}:{row.source_id}  {row.link_type}  {row.target_model}:{row.target_id}" for row in links), {"rows": [output.values(row) for row in links]})
