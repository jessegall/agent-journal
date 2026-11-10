from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.voices.support.voice_choice import VoiceChoice


class VoiceShowSubcommand(ReadSubcommand[str]):
    """`journal voice show`: the instruction the agent is given for how to talk to you."""

    cli_name = "voice"
    name = "show"

    def __init__(self, choice: VoiceChoice) -> None:
        self.choice = choice

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> str:
        return self.choice.instruction()

    def write_output(self, value: object, output: Output) -> None:
        output.line(str(value))
