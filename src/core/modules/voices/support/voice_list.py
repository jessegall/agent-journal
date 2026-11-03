from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class VoiceLine:
    """One voice of the list: its name, what it would say in answer to a finished fix, and whether it is the one chosen."""

    name: str
    sample: str
    chosen: bool


@dataclass(frozen=True)
class VoiceList:
    """The voices and which is chosen, with what the agent calls the user and whether the chat shows a figure."""

    voices: tuple[VoiceLine, ...]
    called: str
    avatar: bool
    avatar_shown: str

    @property
    def chosen(self) -> str:
        return next(voice.name for voice in self.voices if voice.chosen)

    def lines(self) -> Sequence[str]:
        return [f"{'*' if voice.chosen else ' '} {voice.name:<10} {voice.sample}" for voice in self.voices]

    def json(self) -> Mapping[str, object]:
        return {"profile": self.chosen, "called": self.called, "avatar": self.avatar, "avatar_shown": self.avatar_shown,
                "voices": [{"name": voice.name, "sample": voice.sample, "chosen": voice.chosen} for voice in self.voices]}
