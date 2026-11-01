from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.sharing.models.share_link import ShareLink


class ShareSessionSubcommand(ReadSubcommand[ShareLink]):
    """`journal share session <token-digest>`: the link a viewer cookie's token belongs to, whether it is still
    active or has ended, read by the viewer's listener."""

    cli_name = "share"
    name = "session"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_digest")

    def read(self, arguments: Namespace, caller: Caller) -> ShareLink:
        if caller.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer reads a link's session")
        links = list(self.queries.query(ShareLink).filter(token_digest=arguments.token_digest).all_rows())
        if not links:
            raise Refusal("no link has this token")
        return links[0]

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
