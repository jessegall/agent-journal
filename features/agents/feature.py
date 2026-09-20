import time

from controllers.types import Agents, CONTROLLERS, Todos
from engine.sessions import Sessions
from features import trigger
from features.base import Behaviour, Feature, event
from resources.base import SYSTEM

SUBAGENT = "subagent"
STOPPED = "stopped"

LAPSE_MINUTES = 20


class AgentsFeature(Feature):
    name = "agents"
    LAPSE = "lapse"
    QUIET = "quiet"
    quiet = 60
    title_ = "Agents"
    abstract_ = "Every agent session is kept honest: one evicted from its environment is held, one gone quiet is marked stopped, and a subagent's rows are minded and handed back"
    help_ = ("Another session claimed the environment with a reason; the hold names it. A row still saying working or idle with no word from it for agents.quiet (minutes, 60) is marked stopped, "
             "because a session that ended without its last hook would say working for ever. "
             "A subagent is lent an environment (journal environment <n> grant) and names itself with --agent on every command; its rows carry that mark in the same record. "
             "agents.lapse (minutes, 20) is how long it may go silent before an assignment clears.")
    aliases = (("sessions", "eviction"),)
    behaviours = {
        "eviction": Behaviour("Hold a session whose environment was claimed", "Its writes wait until it switches or claims the environment back"),
        "liveness": Behaviour("Mark a silent session stopped", "Checked every hour", trigger={"every": 60, "unit": trigger.MINUTES}),
        "subagents": Behaviour("Mind a subagent's rows", "Its writes keep it alive; a report is handed to the dispatcher; silence gives its rows back"),
    }

    def rows(self, record):
        return Agents(record, actor=SYSTEM)

    @event("agent.updated")
    def evicted(self, event, record) -> None:
        if not self.on(record, "eviction"):
            return
        agent = self.agent(event, record)
        sessions = Sessions(record.root)
        gone = sessions.read(agent.title).get("evicted")
        if gone and not sessions.environment(agent.title):
            self.hold(record, f"environment {gone['environment']!r} was claimed by session {gone['by']} ({gone['why']}): switch to another, or claim it back", "eviction")
        else:
            self.release(record, "eviction")

    @event("agent.updated")
    def sweep(self, event, record) -> None:
        if self.due(record, self.agent(event, record), "liveness"):
            self.quieted(record)

    def quieted(self, record) -> list:
        agents = Agents(record, actor=SYSTEM)
        silent = time.time() - record.setting(self.name, {}).get(self.QUIET, self.quiet) * 60
        gone = [row for row in agents.all() if row.status and row.status != STOPPED and float(row.at or 0) < silent]
        for row in gone:
            agents.stamp(row.n, status=STOPPED)
        return gone

    @event("created")
    def alive(self, event, record) -> None:
        if not self.on(record, "subagents") or event.type == "agent":
            return
        made = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        who = made.agent
        if not who:
            return
        row = self.rows(record).by_session(who)
        self.rows(record).update(row.n, active=time.time(), dispatcher=made.dispatcher or "", status=SUBAGENT)

    @event("todo.updated")
    def reported(self, event, record) -> None:
        if not self.on(record, "subagents"):
            return
        todos = Todos(record, actor=SYSTEM)
        todo = todos.load(event.n)
        said = todo.reported or {}
        if not said or said.get("told"):
            return
        todos.update(todo.n, reported={**said, "told": True})
        if said.get("dispatcher"):
            dispatcher = self.rows(record).by_session(said["dispatcher"])
            self.nudge(record, dispatcher, f"agent {said.get('agent')} reports todo {todo.n} done", f"{said.get('how', '')} — journal todo done {todo.n} is yours")

    @event("agent.updated")
    def lapsed(self, event, record) -> None:
        if not self.on(record, "subagents"):
            return
        limit = record.agents.get(self.LAPSE, LAPSE_MINUTES) * 60
        todos = Todos(record, actor=SYSTEM)
        rows = {a.title: a for a in self.rows(record).all() if a.status == SUBAGENT}
        for t in todos.all():
            who = t.assigned
            if not who or t.completed or who not in rows or time.time() - float(rows[who].active or 0) < limit:
                continue
            todos.update(t.n, assigned="", lapsed=who)
            agent = self.agent(event, record)
            self.nudge(record, agent, f"agent {who} went silent — todo {t.n} is back on the list", f"no write from it for {limit // 60} minutes")
