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
    """`journal link list --source <model or table:n>` or `--target <model or table:n>`: the links from a row, or
    the links that lead to it, each with what it means and the title of the row at each end."""

    cli_name = "link"
    name = "list"

    def __init__(self, queries: Queries, row_refs: RowRefs) -> None:
        self.queries, self.row_refs = queries, row_refs

    def arguments(self, parser: ArgumentParser) -> None:
        ends = parser.add_mutually_exclusive_group(required=True)
        ends.add_argument("--source")
        ends.add_argument("--target")

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[Link]:
        links = self.queries.query(Link)
        if arguments.target:
            target = self.row_refs.parsed(arguments.target)
            return tuple(links.filter(target_model=target.model, target_id=target.row_id).oldest().all_rows())
        source = self.row_refs.parsed(arguments.source)
        return tuple(links.filter(source_model=source.model, source_id=source.row_id).oldest().all_rows())

    def write_output(self, value: object, output: Output) -> None:
        links = [row for row in value if isinstance(row, Link)] if is_tuple(value) else []
        titles = {end: self.title(*end) for end in {end for row in links for end in ((row.source_model, row.source_id), (row.target_model, row.target_id))}}
        output.write("\n".join(f"{row.source_model}:{row.source_id}  {row.link_type}  {row.target_model}:{row.target_id}" for row in links), {"rows": [{**output.values(row), "source_title": titles[(row.source_model, row.source_id)], "target_title": titles[(row.target_model, row.target_id)]} for row in links]})

    def title(self, model_name: str, row_id: int) -> str:
        model = self.row_refs.model(model_name)
        if model is None:
            return ""
        rows = self.queries.query(model).filter(id=row_id).limited(1)
        return next((str(getattr(row, "title", "")) for row in rows), "")
