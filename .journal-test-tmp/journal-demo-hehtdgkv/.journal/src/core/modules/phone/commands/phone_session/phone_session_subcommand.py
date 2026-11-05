from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.phone.models.enums.phone_state import PhoneState
from core.modules.phone.models.phone import Phone


class PhoneSessionSubcommand(ReadSubcommand[Phone]):
    """`journal phone session <token-digest>`: the paired phone a viewer session token belongs to, read by the
    viewer's listener for a cookie it does not hold."""

    cli_name = "phone"
    name = "session"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("token_digest")

    def read(self, arguments: Namespace, caller: Caller) -> Phone:
        if caller.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer reads a phone's session")
        phones = list(self.queries.query(Phone).filter(token_digest=arguments.token_digest, state=PhoneState.PAIRED).all_rows())
        if not phones:
            raise Refusal("no paired phone has this session")
        return phones[0]

    def write_output(self, value: object, output: Output) -> None:
        output.row(value)
