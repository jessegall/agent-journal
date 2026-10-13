"""What a receiver on a lane is handed: its services by type, over the lane's record, and the engine's own reads that a fact dispatched with due asks for."""

import io
import shlex
import time
from collections.abc import Callable
from typing import get_args

from agents import control
from controllers.agents import Agents
from controllers.environments import Environments
from controllers.base import CONTROLLERS
from engine import triggering
from engine import seats
from engine.command_line import command_line
from engine.record import Record
from engine.sessions import Sessions as TheSessions
from events import Fact
from framework.loaded import FEATURES
from framework.parts import Marks as AgentMarks, Speaker
from engine import gates
from events.answers import Answer, Refused as Refusal
from receiving import REFUSE
from receiving.asking import answered
from receiving.ticks import PerAsk, Services
from resources.base import AGENT, SYSTEM, Refused
from resources.runs import Exited
from serving import (SERVED, Adapted as TheRecord, Providers, Chat, Clock, Commands, Files, Processes, ReadFiles, ReadProcesses, ReadRemembered, ReadRows, ReadSessions,
                     Remembered, Rows, Sessions, Settings, Terminal, Marks, ReadMarks, Holds, Elsewhere, ReadElsewhere)


class NobodyToSpeakTo(LookupError):
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

    def of(self, name: str):
        return FEATURES[name].values(self.record)


class AgentTerminal:
    """The keys the journal presses in an agent's terminal."""

    def __init__(self, record, agent):
        self.record, self.agent = record, agent

    def move_to_background(self, running: str = "") -> dict:
        return control.move_to_background(self.record.root, self.record.env, self.agent.title, running)

    def answer_prompt(self, option: int, text: str, options: int) -> None:
        """Answers the question the agent stands at on its own screen: the option is pressed, or the words typed into the free choice."""
        session = self.agent.title
        SERVED.given(Providers).driver(self.agent.provider)(self.record, seats.terminal_of(self.record.root, session) or session).answer_prompt(option, text, options)


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

    def chat(self) -> Speaker:
        agent = Agents(self.record, actor=SYSTEM).primary_to_read()
        if agent is None:
            raise NobodyToSpeakTo.of(f"environment {self.record.env}")
        return Speaker(self.feature, self.record, agent)


class TheEnvironments:
    """The other environments of a journal, each reached by its name."""

    def __init__(self, feature, record):
        self.feature, self.record = feature, record

    def here(self) -> Environment:
        return Environment(self.feature, self.record)

    def named(self, env: str) -> Environment:
        return Environment(self.feature, Record(self.record.root, env))


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

    def write(self, path: str, text: str) -> None:
        written = self.record.root.parent / path
        written.parent.mkdir(parents=True, exist_ok=True)
        written.write_text(text)


class JournalCommands:
    """Journal commands run in this process as the agent the event is about, as a tag's command always ran."""

    def __init__(self, record, agent):
        self.record, self.agent = record, agent

    def run(self, command: str) -> Exited:
        out, err = io.StringIO(), io.StringIO()
        code = command_line().run(["--root", str(self.record.root), "--env", self.record.env, "--session", self.agent.title, "--as", AGENT, *shlex.split(command)],
                                  out=out, err=err)
        return Exited(code, (err.getvalue() or out.getvalue() if code else out.getvalue()).strip())


def lane_services(record, agent: Callable[[], object]) -> dict[type, object]:
    """What a receiver is handed, by the service type it asks for, over this record: the same funnels a 2.x handler reached through its Context. The agent is looked up only when a receiver asks for the chat."""
    def controlling(feature: str, asked):
        return CONTROLLERS[get_args(asked)[0].type](record, actor=SYSTEM)

    return {**SERVED.answering,
            TheRecord: record,
            Clock: TheClock(),
            Files: ProjectFiles(record),
            ReadFiles: ProjectFiles(record),
            ReadProcesses: PerAsk(lambda feature, asked: SERVED.given(Processes)),
            Chat: PerAsk(lambda feature, asked: Speaker(FEATURES[feature], record, agent())),
            Settings: PerAsk(lambda feature, asked: FeatureSettings(FEATURES[feature], record)),
            Rows: PerAsk(controlling),
            ReadRows: PerAsk(controlling),
            Commands: PerAsk(lambda feature, asked: JournalCommands(record, agent())),
            Remembered: PerAsk(lambda feature, asked: record.state(feature)),
            ReadRemembered: PerAsk(lambda feature, asked: record.state(feature)),
            Sessions: PerAsk(lambda feature, asked: TheSessions(record.root)),
            Terminal: PerAsk(lambda feature, asked: AgentTerminal(record, agent())),
            Marks: PerAsk(lambda feature, asked: AgentMarks(FEATURES[feature], record, agent())),
            ReadMarks: PerAsk(lambda feature, asked: AgentMarks(FEATURES[feature], record, agent())),
            Holds: PerAsk(lambda feature, asked: AgentHolds(record, agent())),
            Elsewhere: PerAsk(lambda feature, asked: TheEnvironments(FEATURES[feature], record)),
            ReadElsewhere: PerAsk(lambda feature, asked: TheEnvironments(FEATURES[feature], record)),
            ReadSessions: PerAsk(lambda feature, asked: TheSessions(record.root))}


def agent_of(logged, record):
    """The agent a tick's chat is about: the agent the event is about, else the one the environment's chat is with."""
    agents = Agents(record, actor=SYSTEM)
    row = agents.peek(logged.n) if logged.type == "agent" else agents.primary_to_read()
    if row is None:
        raise NobodyToSpeakTo.of(f"{logged.type} {logged.n}")
    return row


def agent_of_fact(fact, record):
    """The agent a fact run on a lane of its own is about: the one it names, else the one the environment's chat is with."""
    agents = Agents(record, actor=SYSTEM)
    row = agents.peek(fact.agent) if getattr(fact, "agent", 0) else agents.primary_to_read()
    if row is None:
        raise NobodyToSpeakTo.of(type(fact).__name__)
    return row


def due_now(feature, record, fact: Fact) -> bool:
    """Counts the moment against the agent the fact is about, then asks the feature's trigger whether its behaviour is due, as a 2.x handler did with noticed and due."""
    agent = Agents(record, actor=SYSTEM).peek(fact.agent)
    behaviour, = fact.trigger
    triggering.noticed(record, agent, feature.keyed(behaviour))
    return feature.due(record, agent, behaviour)


def answering(registered, request, record) -> Answer:
    """A request answered by the features: a refuser that refuses ends it with its reason, before any answerer is read. Over the record, and about the agent of the session the request names, when it names one."""
    services = Services(lane_services(record, lambda: session_agent(record, request.session)))
    switched_on = lambda feature: FEATURES[feature].enabled(record)  # noqa: E731
    for one in registered.of(REFUSE):
        if one.event is not type(request) or not switched_on(one.feature):
            continue
        try:
            one.receiver.refuse(request, **services.given(one.name, one.feature, type(one.receiver).wants()))
        except Refused as why:
            return Refusal(why=str(why))
    return answered(request, registered, services, switched_on=switched_on)


def session_agent(record, session: str):
    row = Agents(record, actor=SYSTEM).peek_session(session)
    if row is None:
        raise NobodyToSpeakTo.of(f"session {session}")
    return row
