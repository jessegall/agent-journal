from __future__ import annotations

import re
from pathlib import Path

import docs as docs_mod
import fmt
import inbox
import pins
import questions
import reminders
import todo
import tools
import tracks
import update
import work


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


def _live_plans(root: Path, env: str) -> list[dict]:
    import plans as plans_mod
    return [p for p in plans_mod._all(root, env)
            if plans_mod.status(p, plans_mod.phases(root, p, env)) in (plans_mod.DRAFT, plans_mod.ACTIVE)]


# ────────────────────────────────────────────────────────────── environments
def environments(root: Path) -> list[dict]:
    import time
    from datetime import datetime, timezone
    from controllers.activity import ActivityController
    current = tracks.current(root)
    live = tracks.live(root)
    active = {info["track"] for info in live.values()}
    seen = {}
    for info in live.values():
        at = datetime.fromtimestamp(time.time() - (info["age"] or 0), timezone.utc).isoformat(timespec="seconds")
        seen[info["track"]] = max(seen.get(info["track"], ""), at)
    out = []
    for name in tracks._all(root):
        out.append({
            "name": name,
            "current": name == current,
            "active": name in active,
            "todos": len(todo.open_items(root, name)),
            "pins": len(pins.live(root, track=name)),
            "work": len(work.open_work(root, track=name)),
            # the home shows a few finished pieces and "N more": the count comes from here, so the page
            # never pulls every row ever written to count them in the browser
            "work_done": len([w for w in work._all(root, name) if w.get("ended")]),
            "reminders": len(reminders.live(root, track=name)),
            # what is still live: an archived doc is off the catalogue, so it is not something this environment holds
            "docs": len([d for d in docs_on(root, name) if not d.get("archived")]),
            "inbox": len(inbox.unprocessed(root, name)),
            "questions": len(questions.open_items(root, name)),
            "reports": len([r for r in __import__("reports")._all(root, name) if not r.get("archived")]),
            # plans are their own nav entry, counted while they are still live: a done or abandoned plan is the
            # record, not work. THE STATUS IS DERIVED, never the stored field — a plan whose phases are all
            # complete still stores "active", and reading the field counted two finished plans as live.
            "plans": len(_live_plans(root, name)),
            "notifications": len(__import__("notifications").unread(root, name)),
            "suggestions": len(__import__("suggestions").open_items(root, name)),
            # the newest thing that happened there: a journal event, or a live session's last hook event
            "last_active": max([e["at"] for e in ActivityController._events(root, name)[:1]] + [seen.get(name, "")]),
        })
    out.sort(key=lambda e: (e["last_active"], e["name"]), reverse=True)
    return out


def overview(root: Path) -> dict:
    envs = environments(root)
    return {
        "environments": envs,
        "rules": len(pins.live(root, pins.RULES)),
        "docs": len(docs(root)),
        "project": root.resolve().parent.name,
        "version": update.current(root),
        "update": upstream(root),
    }


def upstream(root: Path) -> dict | None:
    got = update.cached(root)
    have = update.current(root)
    version = got.get("version") or ""
    if not version or not update.newer(version, have):
        return None
    return {"version": version, "have": have, "headline": got.get("headline") or ""}


# ────────────────────────────────────────────────────────────────── docs
def docs(root: Path) -> list[dict]:
    return [docs_mod.row(root, d) for d in docs_mod.all_docs(root)
           if docs_mod.scope_of(d) == docs_mod.GLOBAL]


def docs_on(root: Path, env: str) -> list[dict]:
    return [docs_mod.row(root, d) for d in docs_mod.all_docs(root)
           if docs_mod.scope_of(d) == env]


# ────────────────────────────────────────────────────────────────── pins & rules
#: WHERE IN THE TRANSCRIPT A PIN WAS WRITTEN IS FOR `pins around`, not for a reader of
#: the web viewer — it names nothing they can act on. Every pin/rule's meta carries
#: it (or its fallback, "before lines were kept") as one whole segment between the
#: " · " separators `entries.rows` joins with, so it is dropped as a whole segment
#: rather than pattern-matched out of running prose.
_LINE_SEGMENT = re.compile(r"^line \d+$|^before lines were kept$")


def _drop_line_segment(meta: str) -> str:
    return " · ".join(p for p in meta.split(" · ") if not _LINE_SEGMENT.match(p))


#: A FACT IS PRIMARY IF A READER ACTS ON IT WITHOUT DIGGING: how long it has stood, a
#: condition it is waiting on, what it cites. Everything else a CLI meta string carries
#: — a strike reason, "has its reasoning (pins show N)" — is real but secondary: worth
#: keeping, not worth the same weight on the row. `journal <noun>` still shows all of it
#: as one line; this is a WEB-ONLY split of the same response, into what a page shows
#: plainly and what it tucks behind a disclosure (see to-do 15).
def _is_primary_fact(segment: str) -> bool:
    return (segment.endswith(" ago") or segment == "just now"
           or segment.startswith("→ ") or segment.startswith("until:"))


def _split_segments(meta: str) -> list[str]:
    raw = meta.split(" · ") if meta else []
    out: list[str] = []
    for s in raw:
        if out and out[-1].startswith("→ ") and not s.startswith("→ "):
            out[-1] = out[-1] + " · " + s
        else:
            out.append(s)
    return out


def _split_meta(row: dict) -> dict:
    segments = _split_segments(_drop_line_segment(row["meta"]))
    primary = [s for s in segments if _is_primary_fact(s)]
    secondary = [s for s in segments if not _is_primary_fact(s)]
    return {**row, "meta": " · ".join(primary), "meta_secondary": secondary}


# ────────────────────────────────────────────────────────────────── work & reminders
# ────────────────────────────────────────────────────────────────── inbox & questions
def questions_on(root: Path, env: str) -> list[dict]:
    return questions.rows_response(root, env)


def question_detail(root: Path, env: str, n: int) -> dict | None:
    items = questions._all(root, env)
    if n < 1 or n > len(items):
        return None
    return questions.row_response(n, items[n - 1])


def questions_about(root: Path, env: str, ref: str) -> list[dict]:
    return [questions.row_response(n, q) for n, q in questions.about(root, ref, env)]


def questions_everywhere(root: Path, matches) -> list[dict]:
    out = []
    for name in tracks._all(root):
        for n, q in enumerate(questions._all(root, name), 1):
            if not q.get("withdrawn") and any(matches(r) for r in q.get("links") or []):
                out.append({**questions.row_response(n, q), "env": name})
    return out


# ────────────────────────────────────────────────────────────────── tools


# ────────────────────────────────────────────────────────────────── safety
def safe_path(root: Path, project: Path, requested: str) -> Path | None:
    if not requested:
        return None
    try:
        candidate = Path(requested)
        candidate = candidate if candidate.is_absolute() else (root / requested)
        candidate = candidate.resolve()
        root_r, project_r = root.resolve(), project.resolve()
    except (OSError, ValueError):
        return None
    under_root = candidate == root_r or root_r in candidate.parents
    under_project = candidate == project_r or project_r in candidate.parents
    if not (under_root or under_project):
        return None
    return candidate


STATUS = {
    "line": "journal · {env} · {doing} · {viewer}",
    "nothing_open": "nothing open",
    "no_env": "no environment",
    "viewer_up": "viewer {url}",
    "viewer_down": "viewer off: journal serve",
}


def status_line(root: Path, stem: str | None) -> str:
    import serve
    import tracks
    import work
    from templates import render
    env = tracks.current(root, stem)
    opened = work.open_work(root, env) if env else []
    doing = fmt.gist(opened[0]["subject"], 60) if opened else STATUS["nothing_open"]
    url = serve.running(root)
    viewer = render(STATUS["viewer_up"], url=url.rstrip("/")) if url else STATUS["viewer_down"]
    return render(STATUS["line"], env=env or STATUS["no_env"], doing=doing, viewer=viewer)
