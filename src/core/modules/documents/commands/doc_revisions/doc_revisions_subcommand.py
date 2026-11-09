from argparse import ArgumentParser, Namespace
from collections.abc import Sequence

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.type_guards import is_tuple
from core.modules.documents.models.doc_revision import DocRevision
from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent


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
        author_ids = [row.author_id for row in revisions if row.author_id is not None]
        actors = {actor.id: actor.name for actor in self.queries.query(ActorRecord).find_many(author_ids)}
        agents = {agent.id: agent.given_name for agent in self.queries.query(Agent).matching(Among("id", author_ids)).all_rows() if agent.given_name}
        names = {**actors, **agents}

        def author_name(author_id: int | None) -> str:
            return names.get(author_id, "Unknown") if author_id is not None else "Unknown"

        rows = [{**output.values(row), "author_name": author_name(row.author_id)} for row in revisions]
        output.write("\n".join(f"{row.number}  {row.creation_timestamp().text[:16]}  {author_name(row.author_id)}  {row.change}" for row in revisions),
                     {"rows": rows})
