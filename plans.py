from __future__ import annotations

import re
from pathlib import Path

import fmt
import state
import todo
from pins import age
from templates import render

KEY = "plans"
DRAFT, ACTIVE, DONE, ABANDONED = "draft", "active", "done", "abandoned"
#: project-wide: "user" (default) lets only the viewer activate a plan, "agent" lets the CLI do it too
APPROVAL = "plans_approval"

_REF = re.compile(r"^\s*(docs?|reports?)\s*[:#\s]?\s*(\d+(?:\.\d+)?)\s*$", re.I)

MESSAGES = {
    "needs_title": 'a plan needs a title: journal plans add "<title>" --goal="<what is true when it is done>" --brief',
    "needs_goal": 'a plan needs its goal, one line saying what is true when it is done: --goal="<goal>"',
    "added": 'plan {n}: {title} (draft)\n  add its phases: journal plans phase {n} "<title>" --when="<what is true when it is complete>"',
    "no_plan": "there is no plan {n}. `journal plans` numbers them.",
    "phase_title": 'a phase needs a title: journal plans phase {n} "<title>" --when="<what is true when it is complete>"',
    "closed": "plan {n} is {status} and takes no more changes",
    "phase_added": "plan {n} phase {p}: {title}\n  put to-dos in it: journal plans todos {n} {p} <to-do numbers>",
    "no_phase": "plan {n} has no phase {p}",
    "todos_usage": "name the to-dos by number: journal plans todos {n} {p} 4 5 6",
    "no_todo": "there is no to-do {t} on this environment",
    "in_phase": "to-do {t} is already in plan {plan} phase {p}, and a to-do sits in one phase. "
                "Take it out first: journal plans todos {plan} {p} {t} --off",
    "phase_done": 'plan {n} phase {p} is complete; adding a to-do reopens it, so say why: --reopen="<why>"',
    "put": "plan {n} phase {p}: to-do(s) {todos} added",
    "taken": "plan {n} phase {p}: to-do(s) {todos} taken out",
    "not_in": "to-do {t} is not in plan {n} phase {p}",
    "user_activates": "only the user activates a plan: they approve plan {n} in the viewer",
    "no_phases": "plan {n} has no phases yet",
    "first_empty": "plan {n} cannot start: its first phase has no to-dos",
    "one_active": "plan {other} is already active on this environment, and one plan is active at a time",
    "not_draft": "plan {n} is {status}, not a draft",
    "activated": "plan {n} is active; phase 1, {title}, is current",
    "abandon_why": 'say why: journal plans abandon {n} "<why>"',
    "already_abandoned": "plan {n} is already abandoned",
    "abandoned": "plan {n} is abandoned: {why}",
    "not_a_ref": "{text} is not something a plan links; write `doc 4`, `doc 4.2` or `report 1`",
    "no_report": "there is no report {n} on this environment",
    "linked": "plan {n} links {ref}",
    "already_linked": "plan {n} already links {ref}",
    "progress": "{done} of {total} phase(s) complete",
    "current": "phase {p} current: {title}",
    "show": "PLAN {n}  {title}  ({status})\n  goal: {goal}\n  {meta}[\n  links: {refs}]",
    "phase_line": "  {mark} {p}  {title}[ — complete when {when}][  (checkpoint)]",
    "todo_line": "        {mark} to-do {t}  {title}",
    "no_todos_yet": "        no to-dos yet",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def _here(root: Path, track: str | None) -> str:
    return track or state.current_track(root)


def _numbers(values) -> list[int] | None:
    words = re.split(r"[\s,]+", " ".join(values) if isinstance(values, (list, tuple)) else str(values or ""))
    words = [w.lstrip("#") for w in words if w]
    return [int(w) for w in words] if words and all(w.isdigit() for w in words) else None


def _todos(root: Path, track: str) -> dict[int, dict]:
    return {t["n"]: t for t in todo._all(root, track)}


def phases(root: Path, plan: dict, track: str, known: dict[int, dict] | None = None) -> list[dict]:
    """Each phase with its to-dos and whether it is complete; a to-do no longer listed (archived) counts as done."""
    known = _todos(root, track) if known is None else known
    out = []
    for p, ph in enumerate(plan.get("phases") or [], 1):
        rows = []
        for t in ph.get("todos") or []:
            got = known.get(t)
            rows.append({"n": t, "title": (got or {}).get("title", ""), "done": not got or bool(got.get("done")),
                         "gone": got is None})
        out.append({"p": p, "title": ph.get("title", ""), "when": ph.get("when", ""), "checkpoint": bool(ph.get("checkpoint")),
                    "todos": rows, "complete": bool(rows) and all(r["done"] for r in rows), "current": False})
    return out


def status(plan: dict, rows: list[dict]) -> str:
    stored = plan.get("status") or DRAFT
    if stored == ACTIVE and rows and all(r["complete"] for r in rows):
        return DONE
    return stored


def current(plan: dict, rows: list[dict]) -> dict | None:
    """The first phase that is not complete, while the plan is active."""
    if status(plan, rows) != ACTIVE:
        return None
    return next((r for r in rows if not r["complete"]), None)


def membership(root: Path, track: str) -> dict[int, tuple[int, int]]:
    """{to-do number: (plan, phase)} for every plan that is not abandoned."""
    out = {}
    for n, plan in enumerate(_all(root, track), 1):
        if plan.get("status") == ABANDONED:
            continue
        for p, ph in enumerate(plan.get("phases") or [], 1):
            for t in ph.get("todos") or []:
                out[t] = (n, p)
    return out


def _get(items: list[dict], n: int) -> dict | None:
    return items[n - 1] if 1 <= n <= len(items) else None


def _open_for_changes(root: Path, plan: dict, n: int, track: str) -> str:
    got = status(plan, phases(root, plan, track))
    return say("closed", n=n, status=got) if got in (DONE, ABANDONED) else ""


def add(root: Path, title: str, goal: str, body: str, at: str, source: str = "cli",
        track: str | None = None) -> tuple[bool, str]:
    title, goal = " ".join((title or "").split()), " ".join((goal or "").split())
    if not title:
        return False, say("needs_title")
    if not goal:
        return False, say("needs_goal")
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        items.append({"title": title, "goal": goal, "body": (body or "").strip(), "status": DRAFT, "at": at,
                      "source": source, "phases": [], "refs": []})
        _put(root, items, here)
        n = len(items)
    return True, say("added", n=n, title=title)


def add_phase(root: Path, n: int, title: str, when: str, at: str, checkpoint: bool = False,
              track: str | None = None) -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, say("phase_title", n=n)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        closed = _open_for_changes(root, plan, n, here)
        if closed:
            return False, closed
        plan.setdefault("phases", []).append({"title": title, "when": " ".join((when or "").split()),
                                              "checkpoint": bool(checkpoint), "todos": [], "at": at})
        _put(root, items, here)
        p = len(plan["phases"])
    return True, say("phase_added", n=n, p=p, title=title)


def put_todos(root: Path, n: int, p: int, numbers, at: str, off: bool = False, reopen: str = "",
              track: str | None = None) -> tuple[bool, str]:
    """Put to-dos in a phase, or take them out with `off`. A to-do sits in one phase of one plan."""
    wanted = _numbers(numbers)
    if not wanted:
        return False, say("todos_usage", n=n, p=p)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        closed = _open_for_changes(root, plan, n, here)
        if closed:
            return False, closed
        if not 1 <= p <= len(plan.get("phases") or []):
            return False, say("no_phase", n=n, p=p)
        phase = plan["phases"][p - 1]
        held = phase.setdefault("todos", [])
        if off:
            missing = [t for t in wanted if t not in held]
            if missing:
                return False, say("not_in", t=missing[0], n=n, p=p)
            phase["todos"] = [t for t in held if t not in wanted]
            _put(root, items, here)
            return True, say("taken", n=n, p=p, todos=", ".join(map(str, wanted)))
        known = _todos(root, here)
        for t in wanted:
            if t not in known:
                return False, say("no_todo", t=t)
        member = {t: where for t, where in membership(root, here).items()}
        for t in wanted:
            if t in member and member[t] != (n, p):
                return False, say("in_phase", t=t, plan=member[t][0], p=member[t][1])
        fresh = [t for t in wanted if t not in held]
        if phases(root, plan, here, known)[p - 1]["complete"] and fresh:
            why = " ".join((reopen or "").split())
            if not why:
                return False, say("phase_done", n=n, p=p)
            phase.setdefault("reopened", []).append({"at": at, "why": why, "todos": fresh})
        held.extend(fresh)
        _put(root, items, here)
    return True, say("put", n=n, p=p, todos=", ".join(map(str, wanted)))


def approval(root: Path) -> str:
    return "agent" if state.get(root, APPROVAL, "user") == "agent" else "user"


def activate(root: Path, n: int, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    if source != "web" and approval(root) != "agent":
        return False, say("user_activates", n=n)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        known = _todos(root, here)
        rows = phases(root, plan, here, known)
        if (plan.get("status") or DRAFT) != DRAFT:
            return False, say("not_draft", n=n, status=status(plan, rows))
        if not rows:
            return False, say("no_phases", n=n)
        if not rows[0]["todos"]:
            return False, say("first_empty", n=n)
        for other, it in enumerate(items, 1):
            if other != n and status(it, phases(root, it, here, known)) == ACTIVE:
                return False, say("one_active", other=other)
        plan.update(status=ACTIVE, activated_at=at, activated_by=source)
        _put(root, items, here)
    return True, say("activated", n=n, title=rows[0]["title"])


def abandon(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("abandon_why", n=n)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        if plan.get("status") == ABANDONED:
            return False, say("already_abandoned", n=n)
        plan.update(status=ABANDONED, why=why, closed_at=at)
        _put(root, items, here)
    return True, say("abandoned", n=n, why=why)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    kind = "doc" if m.group(1).lower().startswith("doc") else "report"
    if kind == "report" and "." in m.group(2):
        return None, say("not_a_ref", text=repr(text))
    return f"{kind} {m.group(2)}", ""


def link(root: Path, n: int, ref: str, track: str | None = None) -> tuple[bool, str]:
    got, why = parse_ref(ref)
    if got is None:
        return False, why
    kind, _, num = got.partition(" ")
    here = _here(root, track)
    if kind == "doc":
        import docs
        _, _, err = docs.get(root, num)
        if err:
            return False, err
    else:
        import reports
        if not 1 <= int(num) <= len(reports._all(root, here)) or reports._all(root, here)[int(num) - 1].get("removed"):
            return False, say("no_report", n=num)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        refs = plan.setdefault("refs", [])
        if got in refs:
            return False, say("already_linked", n=n, ref=got)
        refs.append(got)
        _put(root, items, here)
    return True, say("linked", n=n, ref=got)


def row_response(root: Path, n: int, plan: dict, track: str, full: bool = False) -> dict:
    rows = phases(root, plan, track)
    now = current(plan, rows)
    row = {"n": n, "title": plan.get("title", ""), "goal": plan.get("goal", ""), "status": status(plan, rows),
           "at": plan.get("at", ""), "age": age(plan.get("at", "")) if plan.get("at") else "",
           "refs": list(plan.get("refs") or []), "why": plan.get("why") or "",
           "phases_total": len(rows), "phases_done": sum(1 for r in rows if r["complete"]),
           "current": now["p"] if now else None, "gist": fmt.gist(plan.get("goal", ""))}
    row["meta"] = " · ".join(x for x in (row["age"], say("progress", done=row["phases_done"], total=row["phases_total"]),
                                         say("current", p=now["p"], title=now["title"]) if now else "",
                                         row["why"]) if x)
    if full:
        for r in rows:
            r["current"] = bool(now) and r["p"] == now["p"]
        row.update(phases=rows, body=plan.get("body", ""), activated_at=plan.get("activated_at") or "")
    return row


def render_show(d: dict) -> str:
    lines = [say("show", n=d["n"], title=d["title"], status=d["status"], goal=d["goal"], meta=d["meta"],
                 refs=", ".join(d["refs"]) or None)]
    for ph in d["phases"]:
        mark = "✓" if ph["complete"] else "▸" if ph["current"] else "○"
        lines.append(say("phase_line", mark=mark, p=ph["p"], title=ph["title"], when=ph["when"] or None,
                         checkpoint=ph["checkpoint"] or None))
        lines.extend(say("todo_line", mark="[x]" if t["done"] else "[ ]", t=t["n"], title=t["title"] or "(archived)")
                     for t in ph["todos"])
        if not ph["todos"]:
            lines.append(say("no_todos_yet"))
    if d.get("body"):
        lines.extend(["", fmt.prose(d["body"])])
    return "\n".join(lines)
