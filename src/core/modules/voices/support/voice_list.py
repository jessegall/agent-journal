from collections.abc import Mapping, Sequence
from dataclasses import dataclass

from core.modules.voices.support.voice_line import VoiceLine


@dataclass(frozen=True)
class VoiceList:
    """The voices and which is selected, with what the agent calls the user and whether the chat shows a figure."""

    voices: tuple[VoiceLine, ...]
    called: str
    avatar: bool
    avatar_shown: str

    @property
    def selected(self) -> str:
        return next(voice.name for voice in self.voices if voice.selected)

    def lines(self) -> Sequence[str]:
        return [f"{'*' if voice.selected else ' '} {voice.name:<10} {voice.sample}" for voice in self.voices]

    def json(self) -> Mapping[str, object]:
        return {"profile": self.selected, "called": self.called, "avatar": self.avatar, "avatar_shown": self.avatar_shown,
                "voices": [{"name": voice.name, "sample": voice.sample, "chosen": voice.selected} for voice in self.voices]}
