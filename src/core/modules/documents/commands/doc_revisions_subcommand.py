from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.documents.models.doc_revision import DocRevision


class DocRevisionsSubcommand(ReadSubcommand[Sequence[DocRevision]]):
    """`journal doc revisions <n>`: each revision of a document, its number, time, and what changed."""

    cli_name = "doc"
    name = "revisions"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> Sequence[DocRevision]:
        return tuple(self.queries.query(DocRevision).filter(doc_id=arguments.id).ordered("number").all_rows())

    def write_output(self, value: object, output: Output) -> None:
        revisions = [row for row in value if isinstance(row, DocRevision)] if is_tuple(value) else []
        output.write("\n".join(f"{row.number}  {row.created_at.text[:16] if row.created_at else ''}  {row.change}" for row in revisions),
                     {"rows": [output.values(row) for row in revisions]})
