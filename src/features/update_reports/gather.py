import subprocess
import time

from controllers.types import Docs, Questions, Reports, Todos, Works
from features.plans.controller import READY, WAITING, Plans
from resources.base import SYSTEM, USER

UPDATE = "update"
NEED, DONE, DOING, PLANS, COMMITS, ALSO = "need", "done", "doing", "plans", "commits", "also"
SECTIONS = (NEED, DONE, DOING, PLANS, COMMITS, ALSO)
FIRST_LOOK = 24 * 3600
GIT_WAIT = 3
MOST_COMMITS = 30


def item(section: str, ref: str, title: str, note: str = "") -> dict:
    return {"section": section, "ref": ref, "title": title, "note": note}


def updates(reports: Reports) -> list[dict]:
    return sorted((s for s in reports.summaries() if s.get("kind") == UPDATE and not s["deleted"]), key=lambda s: s.get("number") or 0)


def opened_until(reports: Reports) -> float:
    opened = [s for s in updates(reports) if USER in s["seen"]]
    return float(opened[-1].get("until") or 0) if opened else 0.0


def since(reports: Reports, now: float) -> float:
    return opened_until(reports) or now - FIRST_LOOK


def waiting(record) -> list[dict]:
    asked = [item(NEED, f"question:{q['n']}", q["title"]) for q in Questions(record, actor=SYSTEM).summaries()
             if not q["completed"] and not q["deleted"] and not q.get("hidden")]
    held = [item(NEED, f"plan:{p.n}", p.title, "Waiting for your approval" if p.status == READY else "Waiting at a checkpoint")
            for p in Plans(record, actor=SYSTEM)._standing() if p.status in (READY, WAITING)]
    return asked + held


def closed(record, start: float) -> list[dict]:
    return [item(DONE, f"todo:{t['n']}", t["title"]) for t in Todos(record, actor=SYSTEM).summaries()
            if t["completed"] >= start and not t["deleted"]]


def working(record) -> list[dict]:
    titles = {t["n"]: t["title"] for t in Todos(record, actor=SYSTEM).summaries()}
    found = {}
    for w in Works(record, actor=SYSTEM)._standing():
        ref = f"todo:{w.todo}" if w.todo in titles else f"work:{w.n}"
        found.setdefault(ref, item(DOING, ref, titles.get(w.todo, w.title)))
    return list(found.values())


def moved(record, start: float, waiting_on: set) -> list[dict]:
    return [item(PLANS, f"plan:{p.n}", p.title, str(p.status or "").capitalize()) for p in Plans(record, actor=SYSTEM)._every()
            if p.updated >= start and not p.deleted and f"plan:{p.n}" not in waiting_on]


def commits(record, start: float) -> list[dict]:
    try:
        out = subprocess.run(["git", "-C", str(record.root.parent), "log", f"--since=@{int(start)}", "--format=%h%x09%s", f"-n{MOST_COMMITS}"],
                             capture_output=True, text=True, timeout=GIT_WAIT).stdout
    except (OSError, subprocess.SubprocessError):
        return []
    lines = [line.split("\t", 1) for line in out.splitlines() if "\t" in line]
    return [item(COMMITS, f"commit:{sha}", subject) for sha, subject in lines]


def written(record, start: float) -> list[dict]:
    docs = [item(ALSO, f"doc:{d['n']}", d["title"]) for d in Docs(record, actor=SYSTEM).summaries() if d["updated"] >= start and not d["deleted"]]
    reports = [item(ALSO, f"report:{r['n']}", r["title"]) for r in Reports(record, actor=SYSTEM).summaries()
               if r["updated"] >= start and not r["deleted"] and r.get("kind") != UPDATE]
    return docs + reports


def gathered(record, start: float) -> list[dict]:
    need = waiting(record)
    return [*need, *closed(record, start), *working(record), *moved(record, start, {i["ref"] for i in need}),
            *commits(record, start), *written(record, start)]


def clock(moment: float) -> str:
    return time.strftime("%a %H:%M", time.localtime(moment))
