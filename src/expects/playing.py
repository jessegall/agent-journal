"""Plays one expectation: builds the world the Given states, runs the registration, and reads what happened.

The Fakes answer and remember. Nothing here knows what any one outcome word means - each word reads the
record of the play itself - so a word added to the grammar is a word added in one place.
"""

import time
from dataclasses import dataclass, field

from expects import At, Answering, Counting, Expectation, Given


class NotAnswered(LookupError):
    @classmethod
    def of(cls, service: str, asked) -> "NotAnswered":
        return cls(f"the expectation does not say what {service} answers for {asked!r}; name it in the Given, as {service}=answering({{{asked!r}: ...}})")


@dataclass
class Seen:
    """What one play recorded. Every outcome word reads this and nothing else, so a play and its judgement cannot disagree."""

    facts: list = field(default_factory=list)
    said: list = field(default_factory=list)
    nudged: list = field(default_factory=list)
    ran: list = field(default_factory=list)
    wrote: list = field(default_factory=list)
    updated: list = field(default_factory=list)
    refused: str | None = None
    changed: str | None = None
    kept: bool = False
    answered: object = None
    held: str | None = None
    before: tuple = ()
    after: tuple = ()
    remembered: dict = field(default_factory=dict)

    @property
    def is_unchanged(self) -> bool:
        return self.before == self.after and not self.wrote and not self.updated


@dataclass
class Chat:
    """What the agent said and what the journal said to it."""

    seen: Seen

    def say(self, text: str) -> None:
        self.seen.said.append(text)

    def nudge(self, line: str, **values) -> None:
        self.seen.nudged.append((line, tuple(sorted(values.items()))))

    def hold(self, why: str) -> None:
        self.seen.held = why


@dataclass
class Commands:
    """Journal commands the registration ran, and what the Given said they answer."""

    seen: Seen
    answers: Answering

    def run(self, command: str):
        self.seen.ran.append(command)
        if command not in self.answers.answers:
            raise NotAnswered.of("commands", command)
        return self.answers.answers[command]


@dataclass
class Processes:
    """Processes started and stopped, by their argv."""

    seen: Seen
    answers: Answering

    def start(self, argv: tuple):
        self.seen.ran.append(argv)
        if argv not in self.answers.answers:
            raise NotAnswered.of("processes", argv)
        return self.answers.answers[argv]


@dataclass
class Files:
    """A file tree in memory. A read of a path the Given does not name is a failure naming the path, never a silent empty file."""

    seen: Seen
    answers: Answering

    def read(self, path: str) -> str:
        if path not in self.answers.answers:
            raise NotAnswered.of("files", path)
        return self.answers.answers[path]

    def write(self, path: str, text: str) -> None:
        self.seen.wrote.append((path, text))


@dataclass
class Providers:
    """What a provider says. It answers and records nothing of its own."""

    answers: Answering

    def of(self, asked):
        if asked not in self.answers.answers:
            raise NotAnswered.of("providers", asked)
        return self.answers.answers[asked]


@dataclass
class Clock:
    """The time the Given fixed. It never comes from the module, so an expectation is exact."""

    at: At

    def now(self) -> float:
        return self.at.seconds


@dataclass
class Ids:
    """The ids the Given counts from, for the same reason."""

    counting: Counting
    drawn: int = 0

    def next(self) -> int:
        self.drawn += 1
        return self.counting.first + self.drawn - 1


@dataclass
class World:
    """Everything one play is given: the Fakes, and what the rows looked like before it ran."""

    seen: Seen
    chat: Chat
    commands: Commands
    files: Files
    processes: Processes
    providers: Providers
    clock: Clock
    ids: Ids

    @classmethod
    def of(cls, given: Given) -> "World":
        seen = Seen()
        return cls(seen, Chat(seen), Commands(seen, given.commands), Files(seen, given.files),
                   Processes(seen, given.processes), Providers(given.providers), Clock(given.clock), Ids(given.ids))

    def given_to(self, wants: dict[str, object]) -> dict:
        """The services a receiver asked for by name, each the Fake that answers for it."""
        return {name: getattr(self, name) for name in wants if hasattr(self, name)}


def wrong(expectation: Expectation, seen: Seen) -> list[str]:
    """What the play did not do that the expectation said it would. Empty when the expectation holds."""
    return [said for one in expectation.outcomes.each if (said := one.holds(seen))]
