"""What a receiver on a lane is handed: its services by type, over the lane's record, and the engine's own reads that a fact dispatched with due asks for."""

import io
import shlex
import time
from collections.abc import Callable
from typing import get_args

from controllers.agents import Agents
from controllers.base import CONTROLLERS
from engine import triggering
from engine.command_line import command_line
from engine.sessions import Sessions as TheSessions
from events import Fact
from framework.loaded import FEATURES
from framework.parts import Speaker
from events.answers import Answer
from receiving.asking import answered
from receiving.ticks import PerAsk, Services
from resources.base import AGENT, SYSTEM
from resources.runs import Exited
from serving import (SERVED, Adapted as TheRecord, Chat, Clock, Commands, Files, Processes, ReadFiles, ReadProcesses, ReadRemembered, ReadRows, ReadSessions,
                     Remembered, Rows, Sessions, Settings)


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
    triggering.noticed(record, agent, feature.keyed(fact.trigger))
    return feature.due(record, agent, fact.trigger)


def answering(registered, request, record) -> Answer:
    """A request answered by the answerers the features registered, over the record and about the agent of the session it names."""
    services = Services(lane_services(record, lambda: session_agent(record, request.session)))
    return answered(request, registered, services, switched_on=lambda feature: FEATURES[feature].enabled(record))


def session_agent(record, session: str):
    row = Agents(record, actor=SYSTEM).peek_session(session)
    if row is None:
        raise NobodyToSpeakTo.of(f"session {session}")
    return row
