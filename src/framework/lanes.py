"""What a receiver on a lane is handed: its services by type, over the lane's record, and the engine's own reads that a fact dispatched with due asks for."""

import io
from argparse import _SubParsersAction
import shlex
import shutil
import time
from pathlib import Path
from collections.abc import Callable
from typing import get_args

from agents import control
from controllers.agents import Agents
from controllers.environments import Environments
from controllers.base import CONTROLLERS
from declaring.trigger import NOTICES
from engine import bus, triggering
from framework.auto_mode import automatic
from framework.diagnostics import logged
from engine import project_files, runtime, seats, viewer, worktree
from engine.developing import developing
from engine.disk import last_lines
from engine.files import blob_bytes, blob_texts, line_counts
from engine.git import Checkout, checkout_of, commits_since
from engine.locks import project_sweep
from engine.proc import git as run_git
from engine.command_line import command_line
from engine.record import Record
from engine.sessions import Sessions as TheSessions
from events import Fact
from framework.loaded import FEATURES
from framework.parts import Marks as AgentMarks, Speaker
from engine import gates
from engine.state import State
from engine.stored import read_json, write_json, write_text
from events.answers import Answer, Refused as Refusal
from receiving import REFUSE
from controllers.faults import threw
from receiving.asking import answered
from receiving.ticks import IN_HAND, PerAsk, Services, Unserved
from resources.base import AGENT, SYSTEM, Refused
from resources.prompt_answers import PromptAnswer
from resources.runs import Exited
from serving import (SERVED, Adapted as TheRecord, Providers, Asking, SessionMemory, Chat, Clock, Commands, Files, Processes, ReadFiles, ReadProcesses, ReadRemembered, ReadRows, ReadSessions,
                     Remembered, Rows, Sessions, Settings, Terminal, Marks, ReadMarks, Holds, Elsewhere, ReadElsewhere, Git, ReadGit, JournalRoot, ReadJournalRoot, Viewer, ReadViewer, Faults, OwnWork, CommandWords, ReadOwnWork)


class NobodyToSpeakTo(Unserved):
    @classmethod
    def of(cls, about: str) -> "NobodyToSpeakTo":
        return cls(f"a receiver asked for the chat about {about}, and no agent row answers for it")


class FeatureSettings:
    """The asking feature's settings in force and whether each of its behaviours is switched on; another feature's settings are read by its name."""

    def __init__(self, feature, record):
        self.feature, self.record = feature, record

    def __getattr__(self, name: str):
        return getattr(self.feature.values(self.record), name)

    def is_on(self, behaviour: str) -> bool:
        return self.feature.on(self.record, behaviour)

    def automatic(self) -> bool:
        """Whether this environment's agent works the list without asking, as work tracking decides it."""
        return automatic(self.record)

    def of(self, name: str):
        return FEATURES[name].values(self.record)


class TheGit:
    """The git checkouts of the project, read and linked through the one place that runs git."""

    def __init__(self, record):
        self.record = record

    def checkout(self, folder: Path) -> Checkout | None:
        return checkout_of(Path(folder))

    def worktree(self, folder: Path, workspaces) -> Path | None:
        """The linked checkout a folder is in, or nothing when it is in the main one or in none."""
        return worktree.checkout(Path(folder), workspaces)

    def run(self, top: Path, *args: str) -> str:
        return run_git(list(args), Path(top))

    def blobs(self, shas: list[str]) -> dict[str, str]:
        """The text of each stored file named by its hash, in whichever repository of the project holds it."""
        return blob_texts(self.record.root.parent, shas)

    def blob_bytes(self, sha: str) -> bytes | None:
        """The bytes of one stored file, or nothing when no repository of the project holds it."""
        return blob_bytes(self.record.root.parent, sha)

    def commits_since(self, since: float, most: int = 0, timeout: float = 5) -> list[tuple[str, str]]:
        """The commits of the project made since a moment, newest first, each as its hash and its subject."""
        return commits_since(self.record.root.parent, since, most, timeout)

    def line_counts(self, pairs: list[tuple[str, str]]) -> dict:
        """How many lines each pair of stored files differs by."""
        return line_counts(self.record.root.parent, pairs)

    def stamp(self, path: Path) -> int:
        """When a git log last moved, in nanoseconds; none when the file is not there."""
        try:
            return Path(path).stat().st_mtime_ns
        except OSError:
            return 0

    def link(self, top: Path, workspaces) -> None:
        """Shares the project's journal, skills and hooks with a linked checkout, without git seeing them."""
        worktree.share_journal(Path(top), self.record.root, workspaces)


class TheFaults:
    """The fault reports of the environment, filed through the one place that counts a fault seen again."""

    def __init__(self, record):
        self.record = record

    def file(self, title: str, brief: str, **data) -> None:
        FEATURES["dev_faults"].reports.file(self.record, title, brief, **data)

    def log(self, line: str) -> None:
        logged(TheJournalRoot(self.record), line)


class TheCommandWords:
    """The nouns and words the journal's command line parses, read from the parser wired into this process."""

    NO_NOUN = "queries"

    def line(self):
        """The command line wired into this process, its parser built."""
        line = command_line()
        if not line.queries:
            line.parser(self.NO_NOUN)
        return line

    def words(self, noun: str) -> set[str]:
        return set(self.line().words(noun))

    def queries(self) -> set[str]:
        return set(self.line().queries)

    def nouns(self) -> dict[str, set[str]]:
        """Every noun to the words it takes."""
        top = next(a for a in command_line().parser()._actions if isinstance(a, _SubParsersAction))
        out = {}
        for name, command in top.choices.items():
            nested = next((a for a in command._actions if isinstance(a, _SubParsersAction)), None)
            out[name] = set(nested.choices) if nested else set()
        return out


class TheViewer:
    """The viewer the journal serves, read and shown through the one place that knows where it runs."""

    def __init__(self, record):
        self.record = record

    def lately_running(self) -> str:
        """The address the viewer runs at, or nothing when none does."""
        return viewer.lately_running(self.record.root)

    def show(self, url: str, env: str) -> str:
        """Brings the viewer's tab for an environment to the front, opening one when there is none."""
        return viewer.show(url, env)


class TheOwnWork:
    """A feature's own work over this record: each method the feature declares, called with the record first."""

    def __init__(self, feature, record):
        self.feature, self.record = feature, record

    def __getattr__(self, name: str):
        if name.startswith("_"):
            raise AttributeError(name)
        work = getattr(self.feature, name)
        return lambda *args, **more: work(self.record, *args, **more)


class TheSessionMemory:
    """A feature's state for one session, kept in the session's runtime folder."""

    def __init__(self, record, feature: str):
        self.record, self.feature = record, feature

    def of(self, session: str) -> State:
        return self.record.state(self.feature, session)


class TheAsking:
    """The engine's questions, answered by every feature switched on, over this record."""

    def __init__(self, record):
        self.record = record

    def ask(self, request) -> Answer:
        return bus.asked(request, self.record)


class TheJournalRoot:
    """The journal's own folder: paths are read against it, and an absolute one is taken as it is."""

    def __init__(self, record):
        self.record, self.root = record, record.root

    def shared_state(self, name: str) -> State:
        """A small JSON file of state beside the runtime that every environment of the project shares, changed under its lock."""
        return State(runtime.folder(self.root) / name)

    def project(self) -> Path:
        """The folder of the project the journal belongs to."""
        return self.root.parent

    def developing(self) -> bool:
        """Whether the project is the one the journal is built in."""
        return developing(self.root.parent)

    def tail(self, path: str, lines: int) -> str:
        """The last lines of a log, read from its end."""
        return last_lines(self.root / path, lines)

    def is_testing(self) -> bool:
        return runtime.tests_running(self.root)

    def is_warming(self) -> bool:
        return runtime.warming(self.root)

    def environments(self) -> list[str]:
        return [one.env for one in Record.every(self.root)]

    def swept(self, name: str, every: float):
        """Says True to whoever runs the sweep the whole project shares, once in `every` seconds, its stamp kept as a file in the runtime folder."""
        return project_sweep(runtime.folder(self.root) / name, every)

    def trim_logs(self, keep: int, readers_since: float) -> int:
        """Drops the old events of every environment's log and of the project's, keeping a number of them and whatever a reader has not reached."""
        records = Record.every(self.root)
        logs = [one.event_log for one in records] + [one.event_log.project for one in records[:1]]
        return sum(log.trim(keep, readers_since) for log in logs)

    def exists(self, path: str) -> bool:
        return (self.root / path).exists()

    def is_dir(self, path: str) -> bool:
        return (self.root / path).is_dir()

    def is_file(self, path: str) -> bool:
        return (self.root / path).is_file()

    def glob(self, pattern: str) -> list[str]:
        return sorted(str(found.relative_to(self.root)) if found.is_relative_to(self.root) else str(found) for found in self.root.glob(pattern))

    def modified(self, path: str) -> float:
        """When a file last changed, in seconds; none when it is not there."""
        try:
            return (self.root / path).stat().st_mtime_ns / 1e9
        except OSError:
            return 0.0

    def read(self, path: str) -> str:
        return (self.root / path).read_text()

    def read_json(self, path: str, kind: type, default):
        """The JSON a file holds when it is of that kind, else the default."""
        return read_json(self.root / path, kind, default)

    def write_json(self, path: str, data, indent: int | None = None) -> None:
        write_json(self.root / path, data, indent)

    def write(self, path: str, text: str) -> None:
        write_text(self.root / path, text)

    def append(self, path: str, line: str) -> None:
        """Adds a line to a file; a file that cannot be written is left alone."""
        file = self.root / path
        try:
            file.parent.mkdir(parents=True, exist_ok=True)
            with file.open("a") as out:
                out.write(line + "\n")
        except OSError:
            return

    def halve(self, path: str, keep: int) -> None:
        """Drops the older half of a file that has grown past `keep` bytes."""
        file = self.root / path
        try:
            if file.is_file() and file.stat().st_size > keep:
                kept = file.read_text().splitlines()
                file.write_text("\n".join(kept[len(kept) // 2:]) + "\n")
        except OSError:
            return

    def remove(self, path: str) -> None:
        """Takes a file or a folder away; one that is not there stays so."""
        gone = self.root / path
        if gone.is_dir() and not gone.is_symlink():
            shutil.rmtree(gone, ignore_errors=True)
        else:
            gone.unlink(missing_ok=True)

    def trim_tail(self, path: str, keep: int) -> bool:
        """Cuts a file down to its last `keep` bytes, and says whether it was longer."""
        file = self.root / path
        if file.stat().st_size <= keep:
            return False
        with file.open("r+b") as held:
            held.seek(-keep, 2)
            tail = held.read()
            held.seek(0)
            held.write(tail)
            held.truncate()
        return True


class AgentTerminal:
    """The keys the journal presses in an agent's terminal."""

    def __init__(self, record, agent):
        self.record, self.agent = record, agent

    def move_to_background(self, running: str = "") -> dict:
        return control.move_to_background(self.record.root, self.record.env, self.agent.title, running)

    def answer_prompt(self, answer: PromptAnswer) -> None:
        """Answers the question the agent stands at on its own screen: the option is pressed, or the words typed into the free choice."""
        session = self.agent.title
        SERVED.given(Providers).driver(self.agent.provider)(self.record, seats.terminal_of(self.record.root, session) or session).answer_prompt(answer)


class AgentHolds:
    """The holds standing against an agent's writes."""

    def __init__(self, record, agent):
        self.record, self.agent = record, agent

    def why(self, subagent: bool, writing: bool) -> str:
        """Why the agent's next call of this kind is refused, by every standing hold that reaches it; empty when nothing holds it."""
        return gates.held(self.record, self.agent.title, subagent, writing)


class Environment:
    """One environment of the journal, reached from another: the controller of a row type over it, and the chat of its primary agent as the asking feature speaks there."""

    def __init__(self, feature, record):
        self.feature, self.record = feature, record

    @property
    def name(self) -> str:
        return self.record.env

    def rows(self, kind: type):
        return CONTROLLERS[kind.type](self.record, actor=SYSTEM)

    def rows_named(self, type_name: str):
        """The controller of a row type named as the record names it, for a reader that goes over every type."""
        return CONTROLLERS[type_name](self.record, actor=SYSTEM)

    def setting(self, name: str):
        """A setting of the environment itself rather than of a feature, such as the skills it loads."""
        return self.record.settings().get(name)

    def place(self):
        """This environment's own row, as the environments list holds it."""
        return Environments(self.record, actor=SYSTEM).rows.by_title(self.record.env)

    def settings(self, feature: str):
        return FEATURES[feature].values(self.record)

    def is_on(self, feature: str, behaviour: str) -> bool:
        return FEATURES[feature].on(self.record, behaviour)

    def has_chat(self) -> bool:
        return Agents(self.record, actor=SYSTEM).has_primary()

    def chat(self) -> Speaker:
        agent = Agents(self.record, actor=SYSTEM).primary_to_read()
        if agent is None:
            raise NobodyToSpeakTo.of(f"environment {self.record.env}")
        return Speaker(self.feature, self.record, agent)

    def working_folder(self, agent) -> Path:
        """Where an agent works: its own folder when it has one, else the project's."""
        cwd = Path(agent.cwd) if agent.cwd else None
        return cwd if cwd and cwd.is_dir() else self.record.root.parent

    def release(self, behaviour: str = "") -> None:
        """Lets go the holds this feature put on every agent of the environment, under that behaviour."""
        self.feature.release(self.record, behaviour)

    def hold(self, line: str, behaviour: str = "", **values) -> None:
        """Holds the writes of every agent of the environment, with the words of one of this feature's lines."""
        self.feature.hold(self.record, line, behaviour, **values)

    def log(self, line: str, **values):
        """Files one of this feature's lines in the environment's notices."""
        return self.feature.journal.log(self.record, line, **values)

    def chats(self) -> list[Speaker]:
        """The chat of every live agent here, for a line each of them must hear."""
        return [Speaker(self.feature, self.record, agent) for agent in Agents(self.record, actor=SYSTEM).rows.every() if agent.live]

    def notify(self, line: str, **values):
        """A line of the asking feature filed as a notification here, which the user and every agent see until it is cleared; it needs no agent to speak to."""
        return self.feature.journal.notify(self.record, line, **values)

    def clear(self, row, how: str) -> None:
        """Closes a notification or notice the asking feature filed, saying how it was settled."""
        self.feature.journal.clear(self.record, row, how)

    def is_owed(self, feature: str, line: str, rows: tuple[str, ...]) -> bool:
        """Whether a line another feature sent about these rows still asks the agent to act."""
        return FEATURES[feature].is_owed(self.record, line, rows)

    def cursor(self, name: str) -> str:
        """A reader's place in this environment's event log."""
        return self.record.event_log.cursor_text(name)

    def keep_cursor(self, name: str, text: str) -> None:
        self.record.event_log.set_cursor_text(name, text)


class TheEnvironments:
    """The other environments of a journal, each reached by its name."""

    def __init__(self, feature, record):
        self.feature, self.record = feature, record

    def here(self) -> Environment:
        return Environment(self.feature, self.record)

    def named(self, env: str) -> Environment:
        return Environment(self.feature, self.record if env == self.record.env else Record(self.record.root, env))


class TheClock:
    """The time, from the one place a receiver reads it."""

    def now(self) -> float:
        return time.time()


class ProjectFiles:
    """The project's files, by path under the project folder."""

    def __init__(self, record):
        self.record = record

    def read(self, path: str) -> str:
        return (self.record.root.parent / path).read_text()

    def exists(self, path: str) -> bool:
        return (self.record.root.parent / path).exists()

    def listing(self, folder: str) -> list[str]:
        """The names in a folder under the project folder, sorted; none when it is not there."""
        found = self.record.root.parent / folder
        return sorted(one.name for one in found.iterdir()) if found.is_dir() else []

    def is_file(self, path: str) -> bool:
        """Whether a path names a file, under the project folder or as an absolute path."""
        return (self.record.root.parent / path).is_file() or Path(path).is_file()

    def matching(self, name: str) -> list[str]:
        """The project files a bare name or a path's tail names, from the project's file index."""
        return project_files.matching(self.record.root.parent, name)

    def is_indexed(self) -> bool:
        """Whether the project's file index is built, so a name it does not hold is truly absent."""
        return project_files.is_listed(self.record.root.parent)

    def write(self, path: str, text: str) -> None:
        written = self.record.root.parent / path
        written.parent.mkdir(parents=True, exist_ok=True)
        write_text(written, text)


class JournalCommands:
    """Journal commands run in this process as the agent the event is about, as a tag's command always ran."""

    def __init__(self, record, agent):
        self.record, self.agent = record, agent

    def run(self, command: str) -> Exited:
        out, err = io.StringIO(), io.StringIO()
        code = command_line().run(["--root", str(self.record.root), "--env", self.record.env, "--session", self.agent.title, "--as", AGENT, *shlex.split(command)],
                                  out=out, err=err)
        return Exited(code, (err.getvalue() or out.getvalue() if code else out.getvalue()).strip())


def served(record, kind: type, feature: str):
    """A service of the journal for code that runs outside a lane, such as a command, as a receiver of that feature is handed it."""
    return Services(lane_services(record, lambda: None)).given(feature, feature, {"service": kind})["service"]


def lane_services(record, agent: Callable[[], object]) -> dict[type, object]:
    """What a receiver is handed, by the service type it asks for, over this record: the same funnels a 2.x handler reached through its Context. The agent is looked up only when a receiver asks for the chat."""
    def speaking() -> object:
        """The agent the fact in hand names, else the one the lane is about."""
        fact = IN_HAND.get()
        return agent_of_fact(fact, record) if getattr(fact, "agent", 0) else agent()

    def controlling(feature: str, asked):
        return CONTROLLERS[get_args(asked)[0].type](record, actor=SYSTEM)

    return {**SERVED.answering,
            TheRecord: record,
            Clock: TheClock(),
            Files: ProjectFiles(record),
            ReadFiles: ProjectFiles(record),
            ReadProcesses: PerAsk(lambda feature, asked: SERVED.given(Processes)),
            SessionMemory: PerAsk(lambda feature, asked: TheSessionMemory(record, feature)),
            Asking: PerAsk(lambda feature, asked: TheAsking(record)),
            Chat: PerAsk(lambda feature, asked: Speaker(FEATURES[feature], record, speaking())),
            Settings: PerAsk(lambda feature, asked: FeatureSettings(FEATURES[feature], record)),
            Rows: PerAsk(controlling),
            ReadRows: PerAsk(controlling),
            Commands: PerAsk(lambda feature, asked: JournalCommands(record, speaking())),
            Remembered: PerAsk(lambda feature, asked: record.state(feature)),
            ReadRemembered: PerAsk(lambda feature, asked: record.state(feature)),
            Sessions: PerAsk(lambda feature, asked: TheSessions(record.root)),
            Terminal: PerAsk(lambda feature, asked: AgentTerminal(record, speaking())),
            CommandWords: PerAsk(lambda feature, asked: TheCommandWords()),
            Git: PerAsk(lambda feature, asked: TheGit(record)),
            ReadGit: PerAsk(lambda feature, asked: TheGit(record)),
            Faults: PerAsk(lambda feature, asked: TheFaults(record)),
            Viewer: PerAsk(lambda feature, asked: TheViewer(record)),
            ReadViewer: PerAsk(lambda feature, asked: TheViewer(record)),
            OwnWork: PerAsk(lambda feature, asked: TheOwnWork(FEATURES[feature], record)),
            ReadOwnWork: PerAsk(lambda feature, asked: TheOwnWork(FEATURES[feature], record)),
            JournalRoot: PerAsk(lambda feature, asked: TheJournalRoot(record)),
            ReadJournalRoot: PerAsk(lambda feature, asked: TheJournalRoot(record)),
            Marks: PerAsk(lambda feature, asked: AgentMarks(FEATURES[feature], record, speaking())),
            ReadMarks: PerAsk(lambda feature, asked: AgentMarks(FEATURES[feature], record, speaking())),
            Holds: PerAsk(lambda feature, asked: AgentHolds(record, speaking())),
            Elsewhere: PerAsk(lambda feature, asked: TheEnvironments(FEATURES[feature], record)),
            ReadElsewhere: PerAsk(lambda feature, asked: TheEnvironments(FEATURES[feature], record)),
            ReadSessions: PerAsk(lambda feature, asked: TheSessions(record.root))}


def agent_of(logged, record):
    """The agent a tick's chat is about: the agent the event is about, else the one the environment's chat is with."""
    agents = Agents(record, actor=SYSTEM)
    row = agents.peek(logged.n) if logged.type == "agent" else working_agent(record, agents)
    if row is None:
        raise NobodyToSpeakTo.of(f"{logged.type} {logged.n}")
    return row


def working_agent(record, agents):
    """The agent working the environment: the one whose session holds it, else the one the environment's chat is with."""
    holder = TheSessions(record.root).holder(record.env)
    return (agents.rows.by_title(holder) if holder else None) or agents.primary_to_read()


def agent_of_fact(fact, record):
    """The agent a fact run on a lane of its own is about: the one it names, else the one the environment's chat is with."""
    agents = Agents(record, actor=SYSTEM)
    row = agents.peek(fact.agent) if getattr(fact, "agent", 0) else working_agent(record, agents)
    if row is None:
        raise NobodyToSpeakTo.of(type(fact).__name__)
    return row


def due_now(feature, record, fact: Fact) -> bool:
    """Asks the feature's trigger whether its behaviour is due; a trigger that counts notices has the moment counted first, any other writes nothing on a hook that is not due."""
    agent = Agents(record, actor=SYSTEM).peek(fact.agent)
    behaviour, = fact.trigger
    cadence = feature.cadence(record, behaviour)
    if (cadence.unit or cadence.on) == NOTICES:
        triggering.noticed(record, agent, feature.keyed(behaviour))
    return feature.due(record, agent, behaviour)


def answering(registered, request, record) -> Answer:
    """A request answered by the features: a refuser that refuses ends it with its reason, before any answerer is read. Over the record, and about the agent of the session the request names, when it names one."""
    services = Services(lane_services(record, lambda: session_agent(record, request.session)))
    switched_on = lambda feature: record is None or FEATURES[feature].enabled(record)  # noqa: E731
    for one in registered.of(REFUSE):
        if one.event is not type(request) or not switched_on(one.feature):
            continue
        try:
            one.receiver.refuse(request, **services.given(one.name, one.feature, type(one.receiver).wants()))
        except Refused as why:
            return Refusal(why=str(why))
    return answered(request, registered, services, switched_on=switched_on,
                    failed=lambda name, error: record is not None and threw(record.root, record.env, f"the answerer {name}"))


def session_agent(record, session: str):
    row = Agents(record, actor=SYSTEM).peek_session(session)
    if row is None:
        raise NobodyToSpeakTo.of(f"session {session}")
    return row
