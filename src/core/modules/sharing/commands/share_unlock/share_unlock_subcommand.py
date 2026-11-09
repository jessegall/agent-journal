from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.sharing.models.share_link import ShareLink
from core.modules.sharing.support.share_password import SharePassword


class ShareUnlockSubcommand(ReadSubcommand[ShareLink]):
    """`journal share unlock <token-digest> <password>`: the link, when the password is its own, read by the
    viewer's listener."""

    cli_name = "share"
    name = "unlock"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_digest")
        parser.add_argument("--password", required=True)

    def read(self, arguments: Namespace, caller: Caller) -> ShareLink:
        if caller.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer checks a link's password")
        links = list(self.queries.query(ShareLink).filter(token_digest=arguments.token_digest).all_rows())
        if not links or links[0].password_digest is None or not SharePassword.matches(arguments.password, links[0].password_digest):
            raise Refusal("this is not the link's password")
        return links[0]

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
