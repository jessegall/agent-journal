"""Plays one expectation: builds the world the Given states, runs the registration, and reads what happened.

The Fakes answer and remember. Nothing here knows what any one outcome word means - each word reads the
record of the play itself - so a word added to the grammar is a word added in one place.
"""

import time
from dataclasses import dataclass, field
from typing import ClassVar

from engine.record import Record
from engine.stored import read_json
from expects import At, Answering, Counting, Expectation, Given, NoSuchService
from resources.base import SYSTEM


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
    files: dict = field(default_factory=dict)
    settings: dict = field(default_factory=dict)
    whispered: list = field(default_factory=list)
    typed: list = field(default_factory=list)

    def forget(self) -> None:
        """Forgets what the earlier events of a Given did, so the outcomes judge what the last one did. What they left in the record stands."""
        self.facts, self.ran = [], []
        self.refused = self.changed = None
        self.kept, self.answered = False, None

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
class Asked:
    """A service that answers only what the Given named: anything else is a failure naming the ask, never a silent empty answer. This one rule is what makes a Fake trustworthy, so every Fake that answers reads it from here."""

    service: ClassVar[str] = ""

    seen: Seen
    answers: Answering

    def answer(self, asked):
        if asked not in self.answers.answers:
            raise NotAnswered.of(self.service, asked)
        return self.answers.answers[asked]


@dataclass
class Commands(Asked):
    """Journal commands the registration ran, and what the Given said they answer."""

    service: ClassVar[str] = "commands"

    def run(self, command: str):
        self.seen.ran.append(command)
        return self.answer(command)


@dataclass
class Processes(Asked):
    """Processes started and stopped, by their argv."""

    service: ClassVar[str] = "processes"

    def start(self, argv: tuple):
        self.seen.ran.append(argv)
        return self.answer(argv)


@dataclass
class Files(Asked):
    """A file tree in memory. A read of a path the Given does not name is a failure naming the path, never a silent empty file."""

    service: ClassVar[str] = "files"

    def read(self, path: str) -> str:
        return self.answer(path)

    def write(self, path: str, text: str) -> None:
        self.seen.wrote.append((path, text))


@dataclass
class Providers(Asked):
    """What a provider says."""

    service: ClassVar[str] = "providers"

    def of(self, asked):
        return self.answer(asked)


@dataclass
class Clock:
    """The time the Given fixed. It never comes from the module, so an expectation is exact."""

    at: At

    def now(self) -> float:
        return self.at.seconds


class Ids:
    """The ids the Given counts from, for the same reason."""

    def __init__(self, counting: Counting):
        self.counting = counting
        self.drawn = 0

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
                   Processes(seen, given.processes), Providers(seen, given.providers), Clock(given.clock), Ids(given.ids))

    def given_to(self, wants: dict[str, object]) -> dict:
        """The services a receiver asked for by name, each the Fake that answers for it."""
        for name in wants:
            if not hasattr(self, name):
                raise NoSuchService.named(name)
        return {name: getattr(self, name) for name in wants}


def wrong(expectation: Expectation, seen: Seen) -> list[str]:
    """What the play did not do that the expectation said it would. Empty when the expectation holds."""
    return [said for one in expectation.outcomes.each if (said := one.holds(seen))]


def remembered_by(record: Record, owner: str) -> dict:
    """What the feature left in the journal's memory: its own state, the state it keeps for each agent session, and the marks its triggers keep for each session, each under the name of its file."""
    from controllers.types import Agents
    from engine import runtime
    agents = Agents(record, actor=SYSTEM).rows.standing()
    sessions = (record.state(owner, row.title).all() for row in agents)
    marks = {path.stem: read_json(path, dict, {}) for row in agents for path in runtime.session_file(record.root, row.title, "marks").parent.glob("trigger-*.json")}
    return {**record.state(owner).all(), **{key: value for state in sessions for key, value in state.items()}, **marks}
