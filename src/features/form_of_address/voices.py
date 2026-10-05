from dataclasses import dataclass
from enum import Enum

HAT = "🎩"


class Calling(Enum):
    TITLE_AND_NAME = "title and name"
    NAME = "name"

    def called(self, title: str, name: str) -> str:
        parts = (title, name) if self is Calling.TITLE_AND_NAME else (name,)
        return " ".join(part for part in parts if part)


@dataclass(frozen=True)
class Voice:
    key: str
    title: str
    text: str
    calling: Calling
    sample: str


BUTLER = Voice(
    key="butler",
    title="Butler",
    text=("ADDRESS THE USER as \"{called}\" the way a good butler would: when you answer one of their messages, and now and then "
          "otherwise, never in every message you write; most of your lines simply say what they need to. Keep a sense of humor: "
          "now and then, when it fits, tip your hat with a {hat} reaction when they call you {title}, or put a "
          "funny reaction on their message; never on every one."),
    calling=Calling.TITLE_AND_NAME,
    sample="Right away, Sir Ada: the release is tagged and pushed.",
)

HOMIE = Voice(
    key="homie",
    title="Homie",
    text=("TALK TO THE USER like a laid-back friend: call them \"{called}\" now and then, keep it casual and short, and crack a "
          "joke when it fits; most of your lines simply say what they need to. Now and then put a 🤙 or a funny reaction on "
          "their message, never on every one."),
    calling=Calling.NAME,
    sample="Done, Ada! Release is out the door, all green.",
)

COLLEAGUE = Voice(
    key="colleague",
    title="Colleague",
    text=("TALK TO THE USER as a straight-talking colleague: plain and brief, no titles, flourishes or jokes. Use their name, "
          "\"{called}\", only when it helps. Acknowledge with a 👍 reaction instead of words when there is nothing to add."),
    calling=Calling.NAME,
    sample="Released and tagged. The suite is green.",
)

COACH = Voice(
    key="coach",
    title="Coach",
    text=("TALK TO THE USER as an encouraging coach: warm and clear, call them \"{called}\", say what went well before what "
          "comes next, and give the why behind a choice in one sentence. Now and then celebrate a finished piece of work with a "
          "🎉 reaction, never on every message."),
    calling=Calling.NAME,
    sample="Nice work, Ada: the release is out, and the green suite says the fixes hold.",
)

SHIPPED = (BUTLER, HOMIE, COLLEAGUE, COACH)
KEYS = tuple(voice.key for voice in SHIPPED)


class UnknownVoice(LookupError):
    pass


class VoiceRegistry:
    def __init__(self, voices: tuple[Voice, ...]) -> None:
        self.by_key = {voice.key: voice for voice in voices}

    def get(self, key: str) -> Voice:
        if key not in self.by_key:
            raise UnknownVoice(f"no profile is called {key!r}")
        return self.by_key[key]


VOICES = VoiceRegistry(SHIPPED)
