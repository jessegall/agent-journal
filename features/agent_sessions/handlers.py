import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentChanged, AgentReported, ResourceCreated, ResourceEvent
from engine.sessions import Sessions
from features.parts import AgentContext, Context, Handler
from providers import PROVIDERS

SUBAGENT = "subagent"
STOPPED = "stopped"
STOP = "stop"
MINUTE = 60

COMPACTING = "compacting"
KEPT_COMPACTIONS = 50
ONE_COMPACTION = 120


@dataclass(frozen=True)
class TodoUpdated(ResourceEvent):
    on: ClassVar[str] = "todo.updated"


class HoldEvicted(Handler):
    behaviour = "eviction"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        sessions = Sessions(context.record.root)
        session = context.agent.session
        gone = sessions.read(session).get("evicted")
        if gone and not sessions.environment(session):
            context.hold("evicted", "eviction", environment=repr(gone["environment"]), by=gone["by"], why=gone["why"])
        else:
            context.release("eviction")


class RecordCompactions(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        row = context.agent.row
        kept = row.data.get("compactions") or []
        if row.status != COMPACTING or (kept and time.time() - float(kept[-1]["at"]) < ONE_COMPACTION):
            return
        context.journal.agents.update(row.n, compactions=[*kept, {"at": time.time()}][-KEPT_COMPACTIONS:])


class AskToStop(Handler):
    def handle(self, context: Context, event: AgentChanged) -> None:
        row = context.journal.agents.load(event.agent)
        stopping = row.data.get("stopping") or {}
        provider = PROVIDERS.get(row.provider)
        if not stopping or not provider:
            return
        speaking = context.speaking_to(row)
        if speaking.once(STOP, f"{stopping['task']}|{stopping['at']}"):
            speaking.agent.say(STOP, what=stopping["what"], how=provider().stop_instruction(stopping["task"]))


class MarkSilentStopped(Handler):
    behaviour = "liveness"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
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
        reported = todo.reported or {}
        if not reported or reported.get("notified"):
            return
        todos.update(todo.n, reported={**reported, "notified": True})
        if reported.get("dispatcher"):
            dispatcher = context.journal.agents.by_session(reported["dispatcher"])
            context.speaking_to(dispatcher).agent.say("reported", who=reported.get("agent"), n=todo.n, how=reported.get("how", ""))


class ClearLapsedAssignments(Handler):
    behaviour = "subagents"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
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
            context.agent.say("lapsed", who=who, n=t.n, minutes=limit // MINUTE)


class ClearLapsedAssignmentsOnChange(ClearLapsedAssignments):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        if event.action == "updated":
            super().handle(context, event)
