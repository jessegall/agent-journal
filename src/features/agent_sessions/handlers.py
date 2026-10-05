import time
from dataclasses import dataclass
from typing import ClassVar

from engine.events.agents import AgentReported
from engine.events.resources import AgentChanged, ResourceCreated, ResourceEvent
from engine.sessions import Sessions, live
from features.parts import AgentContext, Context, Handler, OnAgentUpdated
from providers import PROVIDERS
from resources.types import COMPACTING, STOPPED, SUBAGENT
from features.trigger import MINUTE
from controllers.types import CONTROLLERS, Agents, Todos


STOP = "stop"

REPORT_WITHIN = 1800

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
        gone = sessions.read(session).evicted
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
        context.journal.get(Agents)._appended(row, "compactions", {"at": time.time()}, KEPT_COMPACTIONS)


class AskToStop(Handler):
    def handle(self, context: Context, event: AgentChanged) -> None:
        row = context.journal.get(Agents).load(event.agent)
        stopping = row.data.get("stopping") or {}
        provider = PROVIDERS.get(row.provider)
        if not stopping or not provider:
            return
        speaking = context.speaking_to(row)
        if speaking.once(STOP, f"{stopping['task']}|{stopping['at']}"):
            speaking.agent.say(STOP, description=stopping["description"], how=provider().stop_instruction(stopping["task"]))


class MarkSilentStopped(Handler):
    behaviour = "liveness"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        agents = context.journal.get(Agents)
        silent = time.time() - context.settings.quiet * MINUTE
        sessions = Sessions(context.record.root)
        for row in agents._every():
            if row.live and float(row.at) < silent and not live(sessions.read(row.title)):
                agents.stamp(row.n, status=STOPPED)


class KeepSubagentAlive(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type == "agent":
            return
        made = context.journal.get(CONTROLLERS[event.type]).load(event.n)
        if made.agent:
            agents = context.journal.get(Agents)
            agents.update(agents.by_session(made.agent).n, active=time.time(), dispatcher=made.dispatcher, status=SUBAGENT)


class LinkReportToSubagent(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: ResourceCreated) -> None:
        if event.type != "report" or event.actor != "agent":
            return
        agents = context.journal.get(Agents)
        row = agents.primary()
        linked = dict((row and row.data.get("subagent_reports")) or {})
        ended = [s for s in (row and row.data.get("subagent_rows")) or [] if s.get("ended") and s["id"] not in linked and time.time() - s["ended"] < REPORT_WITHIN]
        if ended:
            agents.update(row.n, subagent_reports={**linked, max(ended, key=lambda s: s["ended"])["id"]: event.n})


class HandBackReport(Handler):
    behaviour = "subagents"

    def handle(self, context: Context, event: TodoUpdated) -> None:
        todos = context.journal.get(Todos)
        todo = todos.load(event.n)
        reported = todo.reported or {}
        if not reported or reported.get("notified"):
            return
        todos.update(todo.n, reported={**reported, "notified": True})
        if reported.get("dispatcher"):
            dispatcher = context.journal.get(Agents).by_session(reported["dispatcher"])
            context.speaking_to(dispatcher).agent.say("reported", who=reported.get("agent"), n=todo.n, how=reported.get("how", ""))


class ClearLapsedAssignments(Handler):
    behaviour = "subagents"

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        subagents = {a.title: a for a in context.journal.get(Agents)._standing() if a.status == SUBAGENT}
        if not subagents:
            return
        limit = context.settings.lapse * MINUTE
        todos = context.journal.get(Todos)
        for t in todos._standing():
            who = t.assigned
            if not who or who not in subagents or time.time() - float(subagents[who].active) < limit:
                continue
            todos.update(t.n, assigned="", lapsed=who)
            dispatcher = context.journal.get(Agents).by_session(subagents[who].dispatcher)
            context.speaking_to(dispatcher).agent.say("lapsed", who=who, n=t.n, minutes=limit // MINUTE)


class ClearLapsedAssignmentsOnChange(OnAgentUpdated, ClearLapsedAssignments):
    pass
