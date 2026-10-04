import re
import shlex
from dataclasses import dataclass, field

GLOBAL_OPTIONS = ("--root", "--env", "--as", "--session", "--agent")
CALL = re.compile(r"(?:^|[;&|(\n])\s*(journal\s[^;&|\n]*)")


@dataclass(frozen=True)
class JournalCall:
    text: str
    words: tuple[str, ...]
    options: dict[str, str] = field(default_factory=dict)

    @property
    def noun(self) -> str:
        return self.words[0] if self.words else ""

    @property
    def verb(self) -> str:
        return self.words[1] if len(self.words) > 1 else ""

    @property
    def arguments(self) -> tuple[str, ...]:
        return self.words[2:]

    def matches(self, noun: str, *verbs: str) -> bool:
        return self.noun == noun and (not verbs or self.verb in verbs)


def tokens(text: str) -> list[str]:
    try:
        return shlex.split(text)
    except ValueError:
        return text.split()


def parsed(text: str) -> JournalCall | None:
    words = tokens(text)
    if not words or words[0] != "journal":
        return None
    words, options = words[1:], {}
    while words and words[0].startswith("--"):
        option, separator, value = words[0].partition("=")
        if separator or option not in GLOBAL_OPTIONS:
            words = words[1:]
        else:
            value, words = " ".join(words[1:2]), words[2:]
        options[option] = value
    return JournalCall(text, tuple(words), options)


def calls(command: str) -> list[JournalCall]:
    return [call for call in map(parsed, CALL.findall(command)) if call]
