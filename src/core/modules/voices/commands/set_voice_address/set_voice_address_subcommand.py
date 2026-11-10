from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.voices.commands.set_voice_address.set_voice_address import SetVoiceAddress


class SetVoiceAddressSubcommand(Subcommand[SetVoiceAddress, str]):
    """`journal voice address [--title <title>] [--name <name>]`: what the agent calls you."""

    cli_name = "voice"
    name = "address"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--title", default=None)
        parser.add_argument("--name", default=None)

    def command(self, arguments: Namespace, caller: Caller) -> SetVoiceAddress:
        return SetVoiceAddress(arguments.title, arguments.name)

    def write_output(self, value: object, output: Output) -> None:
        output.line(f"the agent calls you {value or 'nothing'}")
