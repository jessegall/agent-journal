from argparse import Namespace

from journal.console.command import Command
from journal.console.where import Where
from journal.features.voices.chosen_voice import ChosenVoice
from journal.features.voices.shipped import Shipped
from journal.repositories.settings import Settings


class VoiceCommand(Command):
    noun = "voice"

    def __init__(self, settings: Settings, chosen: ChosenVoice) -> None:
        self.settings, self.chosen = settings, chosen

    def arguments(self, verbs) -> None:
        self.verb(verbs, "list", "the voices, and which is chosen")
        self.verb(verbs, "choose", "talk in this voice").add_argument("name", choices=[v.name for v in Shipped.ALL])
        me = self.verb(verbs, "me", "what the agent calls you")
        me.add_argument("--title", default=None)
        me.add_argument("--name", default=None)
        self.verb(verbs, "show", "the instruction the agent is given")

    def list(self, args: Namespace, where: Where) -> int:
        chosen = self.chosen.voice().name
        for voice in Shipped.ALL:
            print(f"{'*' if voice.name == chosen else ' '} {voice.name:<10} {voice.sample.replace('{you}', self.chosen.voice().calling.called(self.chosen.title(), self.chosen.first_name(), voice.address) or 'you')}")
        return 0

    def choose(self, args: Namespace, where: Where) -> int:
        from journal.features.voices.feature import Voices
        self._set(Voices.PROFILE.key, args.name, where)
        print(f"voice: {args.name}")
        return 0

    def me(self, args: Namespace, where: Where) -> int:
        from journal.features.voices.feature import Voices
        if args.title is not None:
            self._set(Voices.TITLE.key, args.title, where)
        if args.name is not None:
            self._set(Voices.NAME.key, args.name, where)
        print(f"the agent calls you {self.chosen.voice().calling.called(self.chosen.title(), self.chosen.first_name(), self.chosen.voice().address) or 'nothing'}")
        return 0

    def show(self, args: Namespace, where: Where) -> int:
        print(self.chosen.instruction())
        return 0

    def _set(self, key: str, value: str, where: Where) -> None:
        self.settings.set(key, value, where.actor)
