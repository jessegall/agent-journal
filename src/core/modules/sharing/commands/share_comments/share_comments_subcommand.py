from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.subcommand.row_list import RowList
from core.modules.sharing.models.share_comment import ShareComment


class ShareCommentsSubcommand(ReadSubcommand[RowList]):
    """`journal share comments <id>`: what visitors wrote through a link, oldest first."""

    cli_name = "share"
    name = "comments"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("link_id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> RowList:
        comments = self.queries.query(ShareComment).filter(share_link_id=arguments.link_id).oldest().all_rows()
        return RowList([{"id": row.id, "visitor_name": row.visitor_name, "text": row.text, "created_at": row.creation_timestamp().text} for row in comments])

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, RowList):
            output.write("\n".join(f"{row['visitor_name']}: {row['text']}" for row in value.rows) or "no comments", value.json())
