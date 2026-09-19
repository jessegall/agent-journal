from pathlib import Path

from controllers.types import Agents, Environments, Messages, Plans, Questions, Suggestions, Todos, Works
from engine.manifest import manifest
from engine.record import Record
from features.auto.feature import Auto
from resources.base import SYSTEM, USER

SHOWN = ("ready", "active", "waiting", "done")


def phase_done(phase: dict, todos: dict) -> bool:
    return bool(phase["todos"]) and all(todos.get(n) for n in phase["todos"])


def plan(p, todos: dict) -> dict:
    current = p.phases[p.current - 1] if p.phases and 0 < p.current <= len(p.phases) else None
    return {"n": p.n, "title": p.title, "status": p.status, "current": p.current, "phase": current["title"] if current else "",
            "phases": len(p.phases), "done": sum(phase_done(ph, todos) for ph in p.phases)}


def environment(record: Record) -> dict:
    agent = Agents(record, actor=SYSTEM).primary()
    works = [w for w in Works(record, actor=SYSTEM).all() if not w.deleted]
    current = next((w for w in works if not w.completed), None)
    last = works[-1] if works else None
    todos = {t.n: bool(t.completed) for t in Todos(record, actor=SYSTEM).all()}
    work = lambda w: {"n": w.n, "title": w.title, "todo": w.todo} if w else None
    return {
        "name": record.env,
        "agent": {"status": agent.status or "stopped", "provider": agent.provider, "model": agent.model, "context": agent.context,
                  "uses": agent.uses, "started": agent.started, "at": agent.at} if agent else None,
        "work": work(current),
        "last": work(last),
        "plans": [plan(p, todos) for p in Plans(record, actor=SYSTEM).all() if p.status in SHOWN and not p.completed],
        "auto": Auto.on_for(record),
        "counts": {
            "messages": len(Messages(record, actor=SYSTEM).unread(USER)),
            "questions": len([q for q in Questions(record, actor=SYSTEM).all() if not q.completed]),
            "todos": len([n for n, done in todos.items() if not done]),
            "suggestions": len([s for s in Suggestions(record, actor=SYSTEM).all() if not s.completed]),
        },
    }


def summarize(root: Path) -> dict:
    m = manifest(root)
    names = dict.fromkeys([m["environment"], *(e.title for e in Environments(Record(root, m["environment"]), actor=SYSTEM).all() if not e.completed)])
    return {"project": m["project"], "root": str(root), "version": m["version"], "start": m["environment"],
            "environments": [environment(Record(root, name)) for name in names]}
