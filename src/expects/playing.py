"""Plays one expectation: builds the world the Given states, runs the registration, and reads what happened.

The Fakes answer and remember. Nothing here knows what any one outcome word means - each word reads the
record of the play itself - so a word added to the grammar is a word added in one place.
"""

from contextlib import contextmanager
from dataclasses import dataclass, field
from pathlib import Path
from typing import ClassVar

from engine.git import MAIN
from engine.record import Record
from engine.stored import read_json
from expects import At, Answering, Counting, Expectation, Given
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

    def start_detached(self, root, cwd, environment: str, provider: str, args: list[str], conversation: str = "") -> int:
        """An agent started detached from the journal, remembered and answered by what started it: the environment, the provider, its arguments and the conversation it carries on, never the folders."""
        started = ("start detached", environment, provider, tuple(args), conversation)
        self.seen.ran.append(started)
        return self.answer(started)


@dataclass
class Files(Asked):
    """A file tree in memory. A read of a path the Given does not name is a failure naming the path, never a silent empty file."""

    service: ClassVar[str] = "files"

    def read(self, path: str) -> str:
        return self.answer(path)

    def exists(self, path: str) -> bool:
        return path in self.answers.answers

    def listing(self, folder: str) -> list[str]:
        prefix = folder.rstrip("/") + "/"
        return sorted({path[len(prefix):].split("/")[0] for path in self.answers.answers if path.startswith(prefix)})

    def matching(self, name: str) -> list[str]:
        return sorted(path for path in self.answers.answers if f"/{path}".endswith(f"/{name.lstrip('./')}"))

    def is_indexed(self) -> bool:
        return True

    def write(self, path: str, text: str) -> None:
        self.seen.wrote.append((path, text))


@dataclass
class Providers(Asked):
    """What a provider says."""

    service: ClassVar[str] = "providers"

    def of(self, asked):
        return self.answer(asked)


@dataclass(frozen=True)
class CheckedOut:
    """A checkout a Given says a folder is in: where it is, on what branch, and what it lands on, in the shape the real one has."""

    top: Path
    branch: str
    linked: bool = False
    landing: str = ""

    @property
    def name(self) -> str:
        return f"worktree {self.top.name}" if self.linked else MAIN

    @property
    def head_log(self) -> Path:
        return self.top / ".git" / "logs" / "HEAD"

    @property
    def landing_log(self) -> Path:
        return self.top / ".git" / "logs" / "refs" / "remotes" / self.landing


def checked_out(branch: str = "main", top: str = "/work/app", linked: bool = False, landing: str = "origin/main") -> CheckedOut:
    return CheckedOut(Path(top), branch, linked, landing)


@dataclass
class Git(Asked):
    """The git of the project: a checkout and what git printed are what the Given says, and every link it was asked for is remembered. The asks carry no folders, since the play's project is not where an expectation can name."""

    service: ClassVar[str] = "git"

    def checkout(self, folder):
        return self.answer(("checkout",))

    def worktree(self, folder, workspaces):
        return self.answer(("worktree",))

    def run(self, top, *args: str) -> str:
        return self.answer(("git", *args))

    def blobs(self, shas: list[str]) -> dict[str, str]:
        return self.answer(("blobs", tuple(shas)))

    def stamp(self, path) -> int:
        return self.answer(("stamp", Path(path).name))

    def link(self, top, workspaces) -> None:
        self.seen.ran.append(("link", Path(top).name))


@dataclass
class JournalRoot(Asked):
    """The journal's folder: what is in it is what the Given says, every change to it is remembered as a run, and a sweep is taken unless the Given says another process holds it."""

    service: ClassVar[str] = "journal root"

    def named(self, ask: tuple, otherwise):
        return self.answers.answers.get(ask, otherwise)

    def project(self) -> Path:
        return self.named(("project",), Path("/work/app"))

    def is_testing(self) -> bool:
        return self.named(("tests running",), False)

    def is_warming(self) -> bool:
        return self.named(("warming",), False)

    def environments(self) -> list[str]:
        return self.named(("environments",), ["t"])

    @contextmanager
    def swept(self, name: str, every: float):
        self.seen.ran.append(("sweep", name))
        yield self.named(("sweep", name), True)

    def trim_logs(self, keep: int, readers_since: float) -> int:
        self.seen.ran.append(("trim logs", keep))
        return self.named(("trim logs",), 0)

    def exists(self, path: str) -> bool:
        return self.named(("exists", path), False)

    def is_dir(self, path: str) -> bool:
        return self.named(("is dir", path), False)

    def is_file(self, path: str) -> bool:
        return self.named(("is file", path), False)

    def glob(self, pattern: str) -> list[str]:
        return self.named(("glob", pattern), [])

    def modified(self, path: str) -> float:
        return self.named(("modified", path), 0.0)

    def write(self, path: str, text: str) -> None:
        self.seen.ran.append(("write", path, text))

    def append(self, path: str, line: str) -> None:
        self.seen.ran.append(("append", path, line))

    def halve(self, path: str, keep: int) -> None:
        self.seen.ran.append(("halve", path, keep))

    def remove(self, path: str) -> None:
        self.seen.ran.append(("remove", path))

    def trim_tail(self, path: str, keep: int) -> bool:
        self.seen.ran.append(("trim", path, keep))
        return self.named(("trim", path), True)


@dataclass
class Terminal:
    """Keys pressed in the agent's terminal, which the play has none of: each press is remembered as a run."""

    seen: Seen

    def move_to_background(self, running: str = "") -> dict:
        self.seen.ran.append(("move to background", running))
        return {}

    def answer_prompt(self, option: int, text: str, options: int) -> None:
        self.seen.ran.append(("answer prompt", option, text))


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
    commands: Commands
    files: Files
    processes: Processes
    providers: Providers
    git: Git
    journal_root: JournalRoot
    terminal: Terminal
    clock: Clock
    ids: Ids

    @classmethod
    def of(cls, given: Given) -> "World":
        seen = Seen()
        return cls(seen, Commands(seen, given.commands), Files(seen, given.files),
                   Processes(seen, given.processes), Providers(seen, given.providers), Git(seen, given.git), JournalRoot(seen, given.journal_root), Terminal(seen), Clock(given.clock), Ids(given.ids))


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
