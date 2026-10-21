from argparse import Namespace

from journal.console.command import Command
from journal.support.caller import Caller
from journal.features.voices.support.voice_choice import VoiceChoice
from journal.support.builtin_catalogue import BuiltinCatalogue
from journal.repositories.setting_rows import SettingRows


class VoiceCommand(Command):
    noun = "voice"

    def __init__(self, settings: SettingRows, selection: VoiceChoice) -> None:
        self.settings, self.chosen = settings, selection

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the voices, and which is chosen")
        self.verb(verbs, "choose", "talk in this voice").add_argument("name", choices=[v.name for v in BuiltinCatalogue.ALL])
        profile = self.verb(verbs, "address", "what the agent calls you")
        profile.add_argument("--title", default=None)
        profile.add_argument("--name", default=None)
        self.verb(verbs, "show", "the instruction the agent is given")

    def list(self, args: Namespace, caller: Caller) -> int:
        selection = self.chosen.voice().name
        for voice in BuiltinCatalogue.ALL:
            print(f"{'*' if voice.name == selection else ' '} {voice.name:<10} {voice.sample.replace('{you}', self.chosen.voice().calling.called(self.chosen.title(), self.chosen.first_name(), voice.address) or 'you')}")
        return 0

    def choose(self, args: Namespace, caller: Caller) -> int:
        from journal.features.voices.feature import Voices
        self._set(Voices.PROFILE.key, args.name, caller)
        print(f"voice: {args.name}")
        return 0

    def address(self, args: Namespace, caller: Caller) -> int:
        from journal.features.voices.feature import Voices
        if args.title is not None:
            self._set(Voices.TITLE.key, args.title, caller)
        if args.name is not None:
            self._set(Voices.NAME.key, args.name, caller)
        print(f"the agent calls you {self.chosen.voice().calling.called(self.chosen.title(), self.chosen.first_name(), self.chosen.voice().address) or 'nothing'}")
        return 0

    def show(self, args: Namespace, caller: Caller) -> int:
        print(self.chosen.instruction())
        return 0

    def _set(self, key: str, value: str, caller: Caller) -> None:
        self.settings.set(key, value, caller.actor)
