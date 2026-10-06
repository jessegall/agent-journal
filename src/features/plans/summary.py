from typing import TypedDict

from controllers.types import Todos
from features.plans.controller import Plans
from resources.base import SYSTEM

SHOWN = ("building", "ready", "active", "waiting", "done")


class PlanSummary(TypedDict):
    n: int
    title: str
    status: str
    current: int
    phase: str
    phases: int
    rows: int
    done: int


def rows_of(p) -> list[int]:
    return [n for phase in p.phases for n in phase["todos"]]


def plan(p, todos: dict) -> PlanSummary:
    current = p.phases[p.current - 1] if p.phases and 0 < p.current <= len(p.phases) else None
    rows = rows_of(p)
    return {"n": p.n, "title": p.title, "status": p.status, "current": p.current, "phase": current["title"] if current else "",
            "phases": len(p.phases), "rows": len(rows), "done": sum(bool(todos.get(n)) for n in rows)}


def plans_shown(record) -> list[PlanSummary]:
    todos = {row["n"]: bool(row["completed"]) for row in Todos(record, actor=SYSTEM).rows.summaries() if not row["deleted"]}
    return [plan(p, todos) for p in Plans(record, actor=SYSTEM).rows.standing() if p.status in SHOWN]
