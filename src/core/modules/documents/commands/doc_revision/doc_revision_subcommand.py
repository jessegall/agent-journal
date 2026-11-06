from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.commands.support.revision_reading import RevisionReading
from core.modules.documents.models.doc_revision import DocRevision


class DocRevisionSubcommand(ReadSubcommand[RevisionReading]):
    """`journal doc revision <n> <k>`: one revision of a document whole; an old revision is read, never
    restored."""

    cli_name = "doc"
    name = "revision"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("number", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> RevisionReading:
        revisions = self.queries.query(DocRevision).filter(doc_id=arguments.id)
        count = revisions.count()
        if not count:
            raise Refusal(f"doc {arguments.id} has no revisions yet", "its first save writes revision 1")
        revision = revisions.filter(number=arguments.number).first()
        if revision is None:
            raise Refusal(f"doc {arguments.id} has revisions 1 to {count}", "name one of them")
        return RevisionReading(revision, count)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, RevisionReading):
            return
        revision = value.revision
        lines = (f"doc {revision.doc_id}, revision {revision.number} of {value.count}: {revision.title}", revision.abstract, "", revision.body)
        output.write("\n".join(lines), {**output.values(revision), "count": value.count})
