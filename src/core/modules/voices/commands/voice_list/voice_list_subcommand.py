from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue
from core.modules.voices.support.voice_choice import VoiceChoice
from core.modules.voices.support.voice_list import VoiceLine, VoiceList


class VoiceListSubcommand(ReadSubcommand[VoiceList]):
    """`journal voice list`: the voices, each with what it would say, and which is chosen."""

    cli_name = "voice"
    name = "list"

    def __init__(self, choice: VoiceChoice) -> None:
        self.choice = choice

    def arguments(self, parser: ArgumentParser) -> None:
        return None

    def read(self, arguments: Namespace, caller: Caller) -> VoiceList:
        chosen = self.choice.voice().name
        title, first_name = self.choice.title(), self.choice.first_name()
        voices = tuple(VoiceLine(voice.name, voice.sample_for(title, first_name), voice.name == chosen) for voice in BuiltinCatalogue.ALL)
        return VoiceList(voices, self.choice.called(), self.choice.avatar(), self.choice.avatar_shown())
