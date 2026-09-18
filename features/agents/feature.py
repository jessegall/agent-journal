import time

from controllers.types import Agents, CONTROLLERS, Todos
from features.base import Feature, on
from resources.base import SYSTEM

SUBAGENT = "subagent"

LAPSE_MINUTES = 20


class Subagents(Feature):
    name = "agents"
    LAPSE = "lapse"
    title_ = "Subagents"
    abstract_ = "A subagent's writes keep its row alive; a row it reports is handed to the dispatcher; one silent too long gives its rows back"
    help_ = "A subagent is lent an environment (journal environment <n> grant) and names itself with --agent on every command; its rows carry that mark in the same record. agents.lapse (minutes, 20) is how long it may go silent before an assignment clears."

    def rows(self, record):
        return Agents(record, actor=SYSTEM)

    @on("created")
    def alive(self, event, record) -> None:
        if event.type == "agent":
            return
        made = CONTROLLERS[event.type](record, actor=SYSTEM).load(event.n)
        who = made.agent
        if not who:
            return
        row = self.rows(record).by_session(who)
        self.rows(record).update(row.n, active=time.time(), dispatcher=made.dispatcher or "", status=SUBAGENT)

    @on("todo.updated")
    def reported(self, event, record) -> None:
        todos = Todos(record, actor=SYSTEM)
        todo = todos.load(event.n)
        said = todo.reported or {}
        if not said or said.get("told"):
            return
        todos.update(todo.n, reported={**said, "told": True})
        if said.get("dispatcher"):
            dispatcher = self.rows(record).by_session(said["dispatcher"])
            self.nudge(record, dispatcher, f"agent {said.get('agent')} reports todo {todo.n} done", f"{said.get('how', '')} — journal todo done {todo.n} is yours")

    @on("agent.updated")
    def lapsed(self, event, record) -> None:
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
