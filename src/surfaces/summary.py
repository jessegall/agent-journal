import threading
import time
from pathlib import Path

from controllers.types import Agents, Environments, Messages, Notices, Questions, Todos, Works
from features.suggestions.controller import Suggestions
from features.plans.controller import Plans
from engine.manifest import manifest
from engine.record import Record
from features.work_tracking.auto import automatic
from resources.base import SYSTEM, USER
from surfaces.color import identity

SHOWN = ("building", "ready", "active", "waiting", "done")
RECENTLY_ENDED = 600.0
SUBAGENT_FIELDS = ("session", "task", "type", "model", "at", "ended", "status", "running")


def subagents(agent) -> list[dict]:
    if not agent:
        return []
    live = (agent.status or "stopped") != "stopped"
    now = time.time()
    kept = [sub for sub in agent.subagent_rows or [] if sub.get("session")
            and ((sub.get("running") and live) or now - float(sub.get("ended") or 0) < RECENTLY_ENDED)]
    return [{**{key: sub.get(key) for key in SUBAGENT_FIELDS}, "running": bool(sub.get("running") and live), "parent": agent.n} for sub in kept]

KEPT_FOR = 1.0
KEPT: dict[Path, tuple[float, dict]] = {}
BUILDING = threading.Lock()


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
    held = [shelf.load(row["n"]) for row in works if not row["completed"]]
    current = next((w for w in held if not w.parked), None) or next(iter(held), None)
    finished = [row for row in works if row["completed"]]
    last = shelf.load(max(finished, key=lambda row: row["completed"])["n"]) if finished else None
    todos = {row["n"]: bool(row["completed"]) for row in Todos(record, actor=SYSTEM).summaries() if not row["deleted"]}
    work = lambda w: {"n": w.n, "title": w.title, "todo": w.todo, "parked": bool(w.parked), "awaiting": w.awaiting,
                      "completed": w.completed} if w else None
    return {
        "name": record.env,
        "agent": {"status": agent.status or "stopped", "provider": agent.provider, "model": agent.model, "context": agent.context,
                  "uses": agent.uses, "started": agent.started, "at": agent.at, "tool": agent.tool, "file": agent.file,
                  "asking": bool(agent.asking)} if agent else None,
        "work": work(current),
        "last": work(last),
        "plans": [plan(p, todos) for p in Plans(record, actor=SYSTEM)._standing() if p.status in SHOWN],
        "subagents": subagents(agent),
        "auto": automatic(record),
        "counts": {
            "messages": sum(USER not in row["seen"] and not row["completed"] and not row["deleted"] for row in Messages(record, actor=SYSTEM).summaries()),
            "questions": len(Questions(record, actor=SYSTEM)._standing()),
            "todos": len([n for n, done in todos.items() if not done]),
            "suggestions": len(Suggestions(record, actor=SYSTEM)._standing()),
            "prompts": sum(n.data.get("action") == "permission" for n in Notices(record, actor=SYSTEM)._standing()),
        },
    }


def lately_summarized(root: Path) -> dict:
    with BUILDING:
        at, made = KEPT.get(root, (0.0, {}))
        if time.monotonic() - at >= KEPT_FOR:
            made = summarize(root)
            KEPT[root] = (time.monotonic(), made)
        return made


def summarize(root: Path) -> dict:
    m = manifest(root)
    standing = Environments(Record(root, m["environment"]), actor=SYSTEM)._standing()
    owners = {e.title: e.owner for e in standing}
    names = dict.fromkeys([m["environment"], *(e.title for e in standing)])
    return {"project": m["project"], "root": str(root), "version": m["version"], "start": m["environment"], "color": identity(root)["color"],
            "environments": [{**environment(Record(root, name)), "owner": owners.get(name, "")} for name in names]}
