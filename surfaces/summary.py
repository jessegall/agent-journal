from pathlib import Path

from controllers.types import Agents, Environments, Messages, Questions, Todos, Works
from features.suggestions.controller import Suggestions
from features.plans.controller import Plans
from engine.manifest import manifest
from engine.record import Record
from features.work_tracking.auto import automatic
from resources.base import SYSTEM, USER

SHOWN = ("building", "ready", "active", "waiting", "done")


def rows_of(p) -> list[int]:
    return [n for phase in p.phases for n in phase["todos"]]


def plan(p, todos: dict) -> dict:
    current = p.phases[p.current - 1] if p.phases and 0 < p.current <= len(p.phases) else None
    rows = rows_of(p)
    return {"n": p.n, "title": p.title, "status": p.status, "current": p.current, "phase": current["title"] if current else "",
            "phases": len(p.phases), "rows": len(rows), "done": sum(bool(todos.get(n)) for n in rows)}


def environment(record: Record) -> dict:
    agent = Agents(record, actor=SYSTEM).primary()
    shelf = Works(record, actor=SYSTEM)
    works = [row for row in shelf.summaries() if not row["deleted"]]
    current = next((shelf.load(row["n"]) for row in works if not row["completed"]), None)
    last = shelf.load(works[-1]["n"]) if works else None
    todos = {row["n"]: bool(row["completed"]) for row in Todos(record, actor=SYSTEM).summaries() if not row["deleted"]}
    work = lambda w: {"n": w.n, "title": w.title, "todo": w.todo} if w else None
    return {
        "name": record.env,
        "agent": {"status": agent.status or "stopped", "provider": agent.provider, "model": agent.model, "context": agent.context,
                  "uses": agent.uses, "started": agent.started, "at": agent.at} if agent else None,
        "work": work(current),
        "last": work(last),
        "plans": [plan(p, todos) for p in Plans(record, actor=SYSTEM)._standing() if p.status in SHOWN],
        "auto": automatic(record),
        "counts": {
            "messages": sum(USER not in row["seen"] and not row["completed"] and not row["deleted"] for row in Messages(record, actor=SYSTEM).summaries()),
            "questions": len(Questions(record, actor=SYSTEM)._standing()),
            "todos": len([n for n, done in todos.items() if not done]),
            "suggestions": len(Suggestions(record, actor=SYSTEM)._standing()),
        },
    }


def summarize(root: Path) -> dict:
    m = manifest(root)
    names = dict.fromkeys([m["environment"], *(e.title for e in Environments(Record(root, m["environment"]), actor=SYSTEM)._standing())])
    return {"project": m["project"], "root": str(root), "version": m["version"], "start": m["environment"],
            "environments": [environment(Record(root, name)) for name in names]}
