from typing import TypedDict

from controllers.types import Todos
from features.helper_worktrees.controller import Worktrees
from features.helpers.controller import Helpers
from features.plans.controller import Plans
from features.tickets.controller import Tickets
from resources.base import SYSTEM

SHOWN = ("building", "ready", "active", "waiting", "done")


class Helping(TypedDict):
    name: str
    job: str
    branch: str


class PlanSummary(TypedDict):
    n: int
    title: str
    status: str
    current: int
    phase: str
    phases: int
    rows: int
    done: int
    delegated: bool
    helpers: list[Helping]
    tickets: list[int]


def rows_of(p) -> list[int]:
    return [n for phase in p.phases for n in phase["todos"]]


def helping(record, p) -> list[Helping]:
    if not p.delegated or p.current_phase is None:
        return []
    todos, helpers, worktrees = Todos(record, actor=SYSTEM), Helpers(record, actor=SYSTEM), Worktrees(record, actor=SYSTEM)
    held = {todo.assigned for todo in map(todos.load, p.current_phase["todos"]) if not todo.completed and todo.assigned.startswith("helper:")}
    found = [helpers.load(int(ref.partition(":")[2])) for ref in sorted(held)]
    return [{"name": h.name, "job": h.title, "branch": worktrees.load(int(h.worktree)).branch if h.worktree else ""} for h in found]


def open_tickets(record, p) -> list[int]:
    if not p.delegated or p.current_phase is None:
        return []
    tickets = Tickets(record, actor=SYSTEM)
    return [t.n for t in map(tickets.load, p.current_phase.get("tickets", [])) if not t.completed]


def plan(record, p, todos: dict) -> PlanSummary:
    current = p.phases[p.current - 1] if p.phases and 0 < p.current <= len(p.phases) else None
    rows = rows_of(p)
    return {"n": p.n, "title": p.title, "status": p.status, "current": p.current, "phase": current["title"] if current else "",
            "phases": len(p.phases), "rows": len(rows), "done": sum(bool(todos.get(n)) for n in rows),
            "delegated": p.delegated, "helpers": helping(record, p), "tickets": open_tickets(record, p)}


def plans_shown(record) -> list[PlanSummary]:
    todos = {row["n"]: bool(row["completed"]) for row in Todos(record, actor=SYSTEM).rows.summaries() if not row["deleted"]}
    return [plan(record, p, todos) for p in Plans(record, actor=SYSTEM).rows.standing() if p.status in SHOWN]
