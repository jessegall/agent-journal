"""Plays one expectation: builds the world the Given states, runs the registration, and reads what happened.

The Fakes answer and remember. Nothing here knows what any one outcome word means - each word reads the
record of the play itself - so a word added to the grammar is a word added in one place.
"""

from contextlib import contextmanager
from dataclasses import dataclass, field
from pathlib import Path
from typing import ClassVar

from resources.checkout import checkout_name
from engine.record import Record
from engine.stored import read_json
from expects import At, Answering, Counting, Expectation, Given
from resources.agent_starts import AgentToStart, DetachedStart
from resources.commit_logs import CommitsAsked
from resources.base import SYSTEM
from resources.prompt_answers import PromptAnswer


class NotAnswered(LookupError):
    @classmethod
    def of(cls, service: str, asked) -> "NotAnswered":
        return cls(f"the expectation does not say what {service} answers for {asked!r}; name it in the Given, as {service}=answering({{{asked!r}: ...}})")


@dataclass(frozen=True)
class Seen:
    """What one play did, read once it ended. Every outcome word reads this and nothing else, so a play and its judgement cannot disagree."""

    facts: tuple = ()
    said: tuple = ()
    nudged: tuple = ()
    ran: tuple = ()
    wrote: tuple = ()
    updated: tuple = ()
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
    whispered: tuple = ()
    typed: tuple = ()

    @property
    def is_unchanged(self) -> bool:
        return self.before == self.after and not self.wrote and not self.updated


class Recording:
    """What a play does, written down as it runs by the play and by every Fake it hands a receiver; read once at the end as one Seen."""

    def __init__(self):
        self.facts, self.said, self.nudged, self.ran, self.wrote, self.updated = [], [], [], [], [], []
        self.refused: str | None = None
        self.changed: str | None = None
        self.kept = False
        self.answered: object = None
        self.held: str | None = None
        self.before: tuple = ()
        self.after: tuple = ()
        self.remembered: dict = {}
        self.files: dict = {}
        self.settings: dict = {}
        self.whispered, self.typed = [], []

    def forget(self) -> None:
        """Forgets what the earlier events of a Given did, so the outcomes judge what the last one did. What they left in the record stands."""
        self.facts, self.ran = [], []
        self.refused = self.changed = None
        self.kept, self.answered = False, None

    def seen(self) -> Seen:
        return Seen(tuple(self.facts), tuple(self.said), tuple(self.nudged), tuple(self.ran), tuple(self.wrote), tuple(self.updated), self.refused, self.changed,
                    self.kept, self.answered, self.held, self.before, self.after, self.remembered, self.files, self.settings, tuple(self.whispered), tuple(self.typed))


@dataclass
class Asked:
    """A service that answers only what the Given named: anything else is a failure naming the ask, never a silent empty answer. This one rule is what makes a Fake trustworthy, so every Fake that answers reads it from here."""

    service: ClassVar[str] = ""

    recording: Recording
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
        self.recording.ran.append(command)
        return self.answer(command)


@dataclass
class Processes(Asked):
    """Processes started and stopped, by their argv."""

    service: ClassVar[str] = "processes"

    def start(self, argv: tuple):
        self.recording.ran.append(argv)
        return self.answer(argv)

    def alive(self, pid) -> bool:
        return self.answers.answers.get(("alive", pid), False)

    def launched_pid(self, root, name: str) -> int:
        return self.answers.answers.get(("launched", name), 0)

    def start_agent(self, record, start: AgentToStart) -> str:
        """An agent started in a new environment, remembered by its name and what it was started with, and answered by it."""
        started = ("start agent", start.name, start.owner, start.prompt)
        self.recording.ran.append(started)
        return self.answer(started)

    def tell(self, running, text: str) -> bool:
        told = ("tell", running.environment, text)
        self.recording.ran.append(told)
        return self.answer(told)

    def stop(self, record, environment: str) -> None:
        self.recording.ran.append(("stop", environment))

    def start_detached(self, root, start: DetachedStart) -> int:
        """An agent started detached from the journal, remembered and answered by what started it: the environment, the provider, its arguments and the conversation it carries on, never the folders."""
        started = ("start detached", start.environment, start.provider, start.args, start.conversation)
        self.recording.ran.append(started)
        return self.answer(started)


@dataclass
class Files(Asked):
    """A file tree in memory. A read of a path the Given does not name is a failure naming the path, never a silent empty file."""

    service: ClassVar[str] = "files"

    def read(self, path: str) -> str:
        return self.answer(path)

    def exists(self, path: str) -> bool:
        return path in self.answers.answers

    def is_file(self, path: str) -> bool:
        return path in self.answers.answers

    def listing(self, folder: str) -> list[str]:
        prefix = folder.rstrip("/") + "/"
        return sorted({path[len(prefix):].split("/")[0] for path in self.answers.answers if path.startswith(prefix)})

    def matching(self, name: str) -> list[str]:
        return sorted(path for path in self.answers.answers if f"/{path}".endswith(f"/{name.lstrip('./')}"))

    def is_indexed(self) -> bool:
        return True

    def write(self, path: str, text: str) -> None:
        self.recording.wrote.append((path, text))


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
        return checkout_name(self.top, self.linked, self.top)

    def named_in(self, project: Path) -> str:
        return checkout_name(self.top, self.linked, project)

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

    def blob_bytes(self, sha) -> bytes | None:
        return self.answer(("blob", sha))

    def commits_since(self, asked: CommitsAsked) -> list[tuple[str, str]]:
        return self.answers.answers.get(("commits",), [])

    def line_counts(self, pairs: list[tuple[str, str]]) -> dict:
        return self.answer(("line counts", tuple(pairs)))

    def stamp(self, path) -> int:
        return self.answer(("stamp", Path(path).name))

    def link(self, top, workspaces) -> None:
        self.recording.ran.append(("link", Path(top).name))


@dataclass
class CommandWords(Asked):
    """The journal's command words: the Given says which nouns there are and the words each takes."""

    service: ClassVar[str] = "command words"

    def words(self, noun: str) -> set[str]:
        return self.nouns().get(noun, set())

    def queries(self) -> set[str]:
        return self.answers.answers.get(("queries",), set())

    def nouns(self) -> dict[str, set[str]]:
        return self.answers.answers.get(("nouns",), {})


@dataclass
class Viewer(Asked):
    """The viewer: where it runs is what the Given says, and every tab shown is remembered as a run."""

    service: ClassVar[str] = "viewer"

    def lately_running(self) -> str:
        return self.answers.answers.get(("running",), "")

    def show(self, url: str, env: str) -> str:
        self.recording.ran.append(("show", url, env))
        return url


class Held:
    """A shared state file the play keeps in memory: what the Given says it holds, changed as the real one is."""

    def __init__(self, held: dict):
        self.held = dict(held)

    def get(self, key: str, default=None):
        return self.held.get(key, default)

    @contextmanager
    def changing(self):
        yield self.held


@dataclass
class Faults(Asked):
    """The fault reports: each one filed is remembered as a run, with its title."""

    service: ClassVar[str] = "faults"

    def file(self, title: str, brief: str, **data) -> None:
        self.recording.ran.append(("fault", title))

    def log(self, line: str) -> None:
        self.recording.ran.append(("fault log", line))


@dataclass
class JournalRoot(Asked):
    """The journal's folder: what is in it is what the Given says, every change to it is remembered as a run, and a sweep is taken unless the Given says another process holds it."""

    service: ClassVar[str] = "journal root"

    def named(self, ask: tuple, otherwise):
        return self.answers.answers.get(ask, otherwise)

    def project(self) -> Path:
        return self.named(("project",), Path("/work/app"))

    def developing(self) -> bool:
        return self.named(("developing",), False)

    def tail(self, path: str, lines: int) -> str:
        return self.named(("tail", path), "")

    def is_testing(self) -> bool:
        return self.named(("tests running",), False)

    def is_warming(self) -> bool:
        return self.named(("warming",), False)

    def read(self, path: str) -> str:
        return self.named(("read", path), "")

    def read_json(self, path: str, kind: type, default):
        return self.named(("read json", path), default)

    def write_json(self, path: str, data, indent: int | None = None) -> None:
        self.recording.ran.append(("write json", path, data))

    def shared_state(self, name: str):
        return Held(self.named(("state", name), {}))

    def environments(self) -> list[str]:
        return self.named(("environments",), ["t"])

    @contextmanager
    def swept(self, name: str, every: float):
        self.recording.ran.append(("sweep", name))
        yield self.named(("sweep", name), True)

    def trim_logs(self, keep: int, readers_since: float) -> int:
        self.recording.ran.append(("trim logs", keep))
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
        self.recording.ran.append(("write", path, text))

    def append(self, path: str, line: str) -> None:
        self.recording.ran.append(("append", path, line))

    def halve(self, path: str, keep: int) -> None:
        self.recording.ran.append(("halve", path, keep))

    def remove(self, path: str) -> None:
        self.recording.ran.append(("remove", path))

    def trim_tail(self, path: str, keep: int) -> bool:
        self.recording.ran.append(("trim", path, keep))
        return self.named(("trim", path), True)


@dataclass
class OwnWork(Asked):
    """The feature's own work: every method it is asked to do is remembered as a run, and answers what the Given said, else nothing."""

    service: ClassVar[str] = "own work"

    def __getattr__(self, name: str):
        if name.startswith("_"):
            raise AttributeError(name)

        def done(*args, **more):
            self.recording.ran.append(("own work", name, *args))
            return self.answers.answers.get((name, *args))
        return done


@dataclass
class Terminal:
    """Keys pressed in the agent's terminal, which the play has none of: each press is remembered as a run."""

    recording: Recording

    def move_to_background(self, running: str = "") -> dict:
        self.recording.ran.append(("move to background", running))
        return {}

    def answer_prompt(self, answer: PromptAnswer) -> None:
        self.recording.ran.append(("answer prompt", answer.option, answer.text))


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

    recording: Recording
    commands: Commands
    files: Files
    processes: Processes
    providers: Providers
    git: Git
    journal_root: JournalRoot
    faults: Faults
    command_words: CommandWords
    viewer: Viewer
    own_work: OwnWork
    terminal: Terminal
    clock: Clock
    ids: Ids

    @classmethod
    def of(cls, given: Given) -> "World":
        recording = Recording()
        return cls(recording, Commands(recording, given.commands), Files(recording, given.files),
                   Processes(recording, given.processes), Providers(recording, given.providers), Git(recording, given.git), JournalRoot(recording, given.journal_root), Faults(recording, given.faults), CommandWords(recording, given.command_words), Viewer(recording, given.viewer), OwnWork(recording, given.own_work), Terminal(recording), Clock(given.clock), Ids(given.ids))


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
