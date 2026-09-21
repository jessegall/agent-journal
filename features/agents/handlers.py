import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentUpdated, ResourceCreated, ResourceEvent
from engine.sessions import Sessions
from features.parts import Context, Handler

SUBAGENT = "subagent"
STOPPED = "stopped"
MINUTE = 60


@dataclass(frozen=True)
class TodoUpdated(ResourceEvent):
    on: ClassVar[str] = "todo.updated"


class HoldEvicted(Handler):
    behaviour = "eviction"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        if not context.agent:
            return
        sessions = Sessions(context.record.root)
        session = context.agent.session
        gone = sessions.read(session).get("evicted")
        if gone and not sessions.environment(session):
            context.hold("evicted", "eviction", environment=repr(gone["environment"]), by=gone["by"], why=gone["why"])
        else:
            context.release("eviction")


class MarkSilentStopped(Handler):
    behaviour = "liveness"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        agents = context.journal.agents
        silent = time.time() - context.settings.quiet * MINUTE
        for row in agents._every():
            if row.status and row.status != STOPPED and float(row.at or 0) < silent:
                agents.stamp(row.n, status=STOPPED)


class KeepSubagentAlive(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type == "agent":
            return
        made = context.journal.of(event.type).load(event.n)
        if made.agent:
            agents = context.journal.agents
            agents.update(agents.by_session(made.agent).n, active=time.time(), dispatcher=made.dispatcher or "", status=SUBAGENT)


class HandBackReport(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: TodoUpdated) -> None:
        todos = context.journal.todos
        todo = todos.load(event.n)
        said = todo.reported or {}
        if not said or said.get("told"):
            return
        todos.update(todo.n, reported={**said, "told": True})
        if said.get("dispatcher"):
            dispatcher = context.journal.agents.by_session(said["dispatcher"])
            context.speaking_to(dispatcher).agent.say("reported", who=said.get("agent"), n=todo.n, how=said.get("how", ""))


class ClearLapsedAssignments(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: AgentUpdated) -> None:
        subagents = {a.title: a for a in context.journal.agents._standing() if a.status == SUBAGENT}
        if not subagents:
            return
        limit = context.settings.lapse * MINUTE
        todos = context.journal.todos
        for t in todos._standing():
            who = t.assigned
            if not who or who not in subagents or time.time() - float(subagents[who].active or 0) < limit:
                continue
            todos.update(t.n, assigned="", lapsed=who)
            if context.agent:
                context.agent.say("lapsed", who=who, n=t.n, minutes=limit // MINUTE)
