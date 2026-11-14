from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.read_subcommand import ReadSubcommand
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue
from core.modules.voices.support.voice_choice import VoiceChoice
from core.modules.voices.support.voice_line import VoiceLine
from core.modules.voices.support.voice_list import VoiceList


class VoiceListSubcommand(ReadSubcommand[VoiceList]):
    """`journal voice list`: the voices, each with what it would say, and which is selected."""

    cli_name = "voice"
    name = "list"

    def __init__(self, choice: VoiceChoice) -> None:
        self.choice = choice

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> VoiceList:
        selected = self.choice.voice().name
        title, first_name = self.choice.title(), self.choice.first_name()
        voices = tuple(VoiceLine(voice.name, voice.sample_line(title, first_name), voice.name == selected) for voice in BuiltinCatalogue.ALL)
        return VoiceList(voices, self.choice.called(), self.choice.avatar(), self.choice.avatar_shown())
