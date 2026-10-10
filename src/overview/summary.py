import threading
import time
from pathlib import Path

from controllers.types import CONTROLLERS, Agents, Environments, Messages, Notices, Questions, Todos, Works
from engine import runtime
from engine.version import version
from overview.counts import counts
from overview.parts import SUMMARY_COUNTS, SUMMARY_PARTS
from engine.record import Record
from controllers.agents import SILENT
from resources.base import SYSTEM
from providers import PROVIDERS
from engine.color import identity
from typing import TypedDict

RECENT = 600.0
SUBAGENT_FIELDS = ("id", "session", "task", "type", "model", "at", "ended", "status", "running", "refusal", "tool", "file", "outcome")


def last_written(agent, session: str) -> float:
    provider = PROVIDERS[agent.provider]() if agent.provider in PROVIDERS and agent.transcript else None
    found = provider.subagent_transcript(Path(agent.transcript), session) if provider else None
    return found.stat().st_mtime if found else 0.0


def subagents(agent) -> list[dict]:
    if not agent:
        return []
    live = (agent.status or "stopped") != "stopped"
    now = time.time()
    shown = []
    for sub in agent.subagent_rows:
        if not sub.get("session"):
            continue
        active = max(float(sub.get("at", 0.0)), last_written(agent, sub["session"]))
        running = bool(sub.get("running")) and live and now - active < RECENT
        if running or now - float(sub.get("ended", 0.0)) < RECENT:
            shown.append({**{key: sub.get(key) for key in SUBAGENT_FIELDS}, "running": running, "active": active, "parent": agent.n,
                          "report": agent.subagent_reports.get(sub.get("id"), 0)})
    return shown

KEPT_FOR = 4.0
PART_FOR = 30.0
PARTS: dict[tuple[Path, str], tuple[tuple, float, dict]] = {}
KEPT: dict[Path, tuple[float, dict]] = {}
BUILDING = threading.Lock()
REBUILDING: set[Path] = set()




def attention_of(questions: list, prompts: list) -> dict:
    if prompts:
        return {"kind": "permission", "text": prompts[-1].title}
    if questions:
        return {"kind": "question", "text": questions[-1].title}
    return {}


def environment(record: Record) -> dict:
    agent = Agents(record, actor=SYSTEM).primary()
    shelf = Works(record, actor=SYSTEM)
    works = [row for row in shelf.rows.summaries() if not row["deleted"]]
    held = [shelf.load(row["n"]) for row in works if not row["completed"]]
    current = next((w for w in held if not w.parked), None) or next(iter(held), None)
    finished = [row for row in works if row["completed"]]
    last = shelf.load(max(finished, key=lambda row: row["completed"])["n"]) if finished else None
    todos = {row["n"]: bool(row["completed"]) for row in Todos(record, actor=SYSTEM).rows.summaries() if not row["deleted"]}
    work = lambda w: {"n": w.n, "title": w.title, "todo": w.todo, "parked": bool(w.parked), "awaiting": w.awaiting,
                      "completed": w.completed, "created": w.created} if w else None
    questions = Questions(record, actor=SYSTEM).rows.standing()
    permissions = [n for n in Notices(record, actor=SYSTEM).rows.standing() if n.data.get("action") == "permission"]
    prompts = [n for n in permissions if not n.data.get("to")]
    attention = attention_of(questions, prompts)
    return {
        "name": record.env,
        "agent": {"status": agent.status or "stopped", "provider": agent.provider, "model": agent.model, "context": agent.context,
                  "uses": agent.uses, "started": agent.started, "at": agent.at, "tool": agent.tool, "file": agent.file,
                  "asking": bool(agent.asking), "background_run": agent.background_run, "says": agent.last_message, "doing": agent.doing} if agent else None,
        "work": work(current),
        "last": work(last),
        "subagents": subagents(agent),
        "silent": Agents(record, actor=SYSTEM).state(record.env) == SILENT,
        "attention": attention,
        "counts": {
            "messages": counts(Messages(record, actor=SYSTEM))["unread"],
            "questions": len(questions),
            "todos": len([n for n, done in todos.items() if not done]),
            "prompts": len(prompts),
            "routed": len(permissions) - len(prompts),
            **{name: count(record) for name, count in SUMMARY_COUNTS.keyed().items()},
        },
        **{name: part(record) for name, part in SUMMARY_PARTS.keyed().items()},
    }


def held_environment(root: Path, name: str) -> dict:
    """One environment's part of the summary, kept while none of its rows changed: the lists of its rows are the same lists, and the part is not older than PART_FOR."""
    record = Record(root, name)
    marks = tuple(CONTROLLERS[kind](record, actor=SYSTEM).rows.summaries() for kind in sorted(CONTROLLERS))
    held = PARTS.get((root, name))
    if held and time.monotonic() - held[1] < PART_FOR and len(held[0]) == len(marks) and all(kept is now for kept, now in zip(held[0], marks)):
        return held[2]
    made = environment(record)
    PARTS[root, name] = (marks, time.monotonic(), made)
    return made


def lately_summarized(root: Path) -> "JournalSummary":
    with BUILDING:
        if root not in KEPT:
            KEPT[root] = (time.monotonic(), summarize(root))
        at, made = KEPT[root]
        if time.monotonic() - at >= KEPT_FOR and root not in REBUILDING:
            REBUILDING.add(root)
            threading.Thread(target=rebuilt, args=(root,), daemon=True).start()
        return made


def rebuilt(root: Path) -> None:
    try:
        made = summarize(root)
        with BUILDING:
            KEPT[root] = (time.monotonic(), made)
    finally:
        with BUILDING:
            REBUILDING.discard(root)


class JournalSummary(TypedDict):
    project: str
    root: str
    version: str
    start: str
    started: float
    color: str
    environments: list[dict]
    helpers: list[dict]
    tickets: list[dict]


def summarize(root: Path) -> JournalSummary:
    start = runtime.env(root)
    every = Environments(Record(root, start), actor=SYSTEM).rows.standing()
    standing = [e for e in every if e.is_main()]
    owners = {e.title: e.owner for e in standing}
    names = dict.fromkeys([start, *(e.title for e in standing)])
    return {"project": root.resolve().parent.name, "root": str(root), "version": version(), "start": start, "started": runtime.STARTED[0], "color": identity(root)["color"],
            "environments": [{**held_environment(root, name), "owner": owners.get(name, "")} for name in names],
            "helpers": [{**held_environment(root, e.title), "owner": e.owner} for e in every if e.helping],
            "tickets": [{**held_environment(root, e.title), "owner": e.owner} for e in every if e.is_ticket()]}
