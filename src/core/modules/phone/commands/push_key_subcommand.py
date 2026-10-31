from argparse import ArgumentParser, Namespace

from core.base.actor_type import ActorType
from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.phone.commands.ensure_push_keys import EnsurePushKeys
from core.modules.phone.commands.push_key_pair import PushKeyPair


class PushKeySubcommand(Subcommand[EnsurePushKeys, PushKeyPair]):
    """`journal phone push-key`: prints the public key a phone subscribes to push with, making the key pair on the
    first call; only the viewer asks for it, as the journal itself."""

    cli_name = "phone"
    name = "push-key"

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def command(self, arguments: Namespace, caller: Caller) -> EnsurePushKeys:
        if caller.actor.type is not ActorType.CORE:
            raise Refusal("only the viewer asks for the push key")
        return EnsurePushKeys()

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, PushKeyPair):
            output.line(value.public)
