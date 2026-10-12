from dataclasses import dataclass

from events.agents import CommandRan
from engine.journal_calls import PUNCTUATION, JournalCall, pieces
from engine.ran import SHELL
from resources.types import TYPES

TAKES_VALUE = {"--page", "--back"}
OPEN = "open"
WAITING = "waiting"
OPENING = {"show", "read"}
FOUND_LIMIT, READ_LIMIT, KEPT_READS = 4000, 2000, 20


def journal_call(piece: tuple[str, ...]) -> JournalCall | None:
    start = next((i for i, word in enumerate(piece) if word == "journal" or word.endswith("/journal")), None)
    return JournalCall(piece[start:]) if start is not None else None


def asked(call: JournalCall) -> list[str]:
    found, rest = [], list(call.rest)
    while rest:
        word = rest.pop(0)
        if word in TAKES_VALUE or set(word) <= set(PUNCTUATION):
            rest = rest[1:]
        elif not word.startswith("-"):
            found.append(word)
    return found


def back(call: JournalCall) -> int:
    given = [word.removeprefix("--back=") for word in call.rest if word.startswith("--back=")]
    given += [after for word, after in zip(call.rest, call.rest[1:]) if word == "--back"]
    return next((int(value) for value in given if value.isdigit()), 0)


@dataclass(frozen=True)
class SearchMark:
    label: str
    title: str = ""


def mark(call: JournalCall) -> SearchMark | None:
    words = asked(call)
    noun, terms = (words[0], words[1:]) if words else ("", [])
    if noun == "search" and terms:
        return SearchMark(f'Searched the conversation for "{" ".join(terms)}"')
    if noun in TYPES and terms[:1] == ["search"] and terms[1:]:
        return SearchMark(f'Searched {TYPES[noun].details.title.lower()}s for "{" ".join(terms[1:])}"')
    if noun == "conversation":
        return SearchMark("Read the conversation history", {0: "", 1: "before the last compaction"}.get(back(call), f"{back(call)} compactions back"))
    if noun == "user":
        return SearchMark("Searched your messages", "")
    return None


def searches(command: str) -> list[str]:
    if "journal" not in command:
        return []
    try:
        found = pieces(command)
    except ValueError:
        return []
    return [found_mark for call in map(journal_call, found) if call is not None and (found_mark := mark(call))]


def labels(command: str) -> list[str]:
    return [one.label for one in searches(command)]


def opened(event: CommandRan) -> str:
    if event.tool == "Read":
        return f"Read {event.command.rsplit(' ', 1)[-1]}"
    if event.tool != SHELL:
        return ""
    for piece in pieces(event.command):
        call = journal_call(piece)
        words = asked(call) if call else []
        if len(words) > 2 and words[1] in OPENING:
            return f"Opened {words[0]} {words[2]}"
    return ""


class Marks:
    """What the feature remembers of one agent's searches: the card whose result is open, and the searches whose result has not come back."""

    def __init__(self, remembered, agent: int) -> None:
        self.remembered, self.agent = remembered, agent

    @property
    def open(self) -> str:
        return self.remembered.get(f"{OPEN}|{self.agent}") or ""

    @open.setter
    def open(self, key: str) -> None:
        self.remembered.set(f"{OPEN}|{self.agent}", key)

    @property
    def waiting(self) -> list[dict]:
        return self.remembered.get(f"{WAITING}|{self.agent}") or []

    @waiting.setter
    def waiting(self, entries: list[dict]) -> None:
        self.remembered.set(f"{WAITING}|{self.agent}", entries)
