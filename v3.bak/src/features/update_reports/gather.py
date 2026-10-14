import time

from controllers.types import Docs, Questions, Reports, Todos, Works
from controllers.types import Plans
from resources.commit_logs import CommitsAsked
from resources.plans import READY, WAITING
from resources.base import SYSTEM, USER, Summary
from serving import Git
from typing import TypedDict

UPDATE = "update"
NEED, DONE, DOING, PLANS, COMMITS, ALSO = "need", "done", "doing", "plans", "commits", "also"
SECTIONS = (NEED, DONE, DOING, PLANS, COMMITS, ALSO)
FIRST_LOOK = 24 * 3600
GIT_WAIT = 3
MOST_COMMITS = 30
SHORT_SHA = 9


class Item(TypedDict):
    section: str
    ref: str
    title: str
    note: str


def item(section: str, ref: str, title: str, note: str = "") -> Item:
    return {"section": section, "ref": ref, "title": title, "note": note}


def updates(reports: Reports) -> list[Summary]:
    return sorted((s for s in reports.rows.summaries() if s.extras.get("kind") == UPDATE and not s.deleted), key=lambda s: s.extras.get("number") or 0)


def opened_until(reports: Reports) -> float:
    opened = [s for s in updates(reports) if USER in s.seen and s.extras["until"] is not None]
    return float(opened[-1].extras["until"]) if opened else 0.0


def since(reports: Reports, now: float) -> float:
    return opened_until(reports) or now - FIRST_LOOK


def waiting(record) -> list[dict]:
    asked = [item(NEED, f"question:{q.n}", q.title) for q in Questions(record, actor=SYSTEM).rows.summaries()
             if not q.completed and not q.deleted and not q.extras.get("hidden")]
    held = [item(NEED, f"plan:{p.n}", p.title, "Waiting for your approval" if p.status == READY else "Waiting at a checkpoint")
            for p in Plans(record, actor=SYSTEM).rows.standing() if p.status in (READY, WAITING)]
    return asked + held


def closed(record, start: float) -> list[dict]:
    return [item(DONE, f"todo:{t.n}", t.title) for t in Todos(record, actor=SYSTEM).rows.summaries()
            if t.completed >= start and not t.deleted]


def working(record) -> list[dict]:
    titles = {t.n: t.title for t in Todos(record, actor=SYSTEM).rows.summaries()}
    found = {}
    for w in Works(record, actor=SYSTEM).rows.standing():
        ref = f"todo:{w.todo}" if w.todo in titles else f"work:{w.n}"
        found.setdefault(ref, item(DOING, ref, titles.get(w.todo, w.title)))
    return list(found.values())


def moved(record, start: float, waiting_on: set) -> list[dict]:
    return [item(PLANS, f"plan:{p.n}", p.title, str(p.status).capitalize()) for p in Plans(record, actor=SYSTEM).rows.every()
            if p.updated >= start and not p.deleted and f"plan:{p.n}" not in waiting_on]


def commits(git: Git, start: float) -> list[dict]:
    return [item(COMMITS, f"commit:{sha[:SHORT_SHA]}", subject) for sha, subject in git.commits_since(CommitsAsked(start, MOST_COMMITS, GIT_WAIT))]


def written(record, start: float) -> list[dict]:
    docs = [item(ALSO, f"doc:{d.n}", d.title) for d in Docs(record, actor=SYSTEM).rows.summaries() if d.updated >= start and not d.deleted]
    reports = [item(ALSO, f"report:{r.n}", r.title) for r in Reports(record, actor=SYSTEM).rows.summaries()
               if r.updated >= start and not r.deleted and r.extras.get("kind") != UPDATE]
    return docs + reports


def gathered(record, git: Git, start: float) -> list[dict]:
    need = waiting(record)
    return [*need, *closed(record, start), *working(record), *moved(record, start, {i["ref"] for i in need}),
            *commits(git, start), *written(record, start)]


def clock(moment: float) -> str:
    return time.strftime("%a %H:%M", time.localtime(moment))
