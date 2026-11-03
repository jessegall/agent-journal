from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.voices.commands.voice_address.address_voice import AddressVoice


class VoiceAddressSubcommand(Subcommand[AddressVoice, str]):
    """`journal voice address [--title <title>] [--name <name>]`: what the agent calls you."""

    cli_name = "voice"
    name = "address"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--title", default=None)
        parser.add_argument("--name", default=None)

    def command(self, arguments: Namespace, caller: Caller) -> AddressVoice:
        return AddressVoice(arguments.title, arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"the agent calls you {value or 'nothing'}")
