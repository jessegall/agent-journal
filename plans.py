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

_PHASE_PART = re.compile(r"^\s*phase\s*\d*\s*[:.\-–—]?\s*(.*)$", re.I)

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
    "stall_checkpoint": "plan {n} stopped after phase {p}, {title}: it is a checkpoint, and the user continues the plan in the viewer",
    "stall_empty": "plan {n} phase {p}, {title}, is current and has no to-dos: break it down with `journal todos add` "
                   "and `journal plans todos {n} {p} <numbers>`",
    "stall_draft": "plan {n} is a draft: its to-dos wait until the user approves it in the viewer",
    "continue_user": "only the user continues a plan past a checkpoint: they do it in the viewer",
    "no_checkpoint": "plan {n} is not stopped at a checkpoint",
    "continued": "plan {n} continues past phase {p}, {title}",
    "phase_note": "Plan {n}, phase {p} is complete: {title}",
    "carry": "PLAN {n} IS ACTIVE here: {title}\n  phase {p} of {total} is current: {phase}[ — complete when {when}]\n"
             "  auto mode picks to-dos from this phase only; `journal plans show {n}` reads the plan",
    "carry_held": "PLAN {n} IS ACTIVE here: {title}\n  it stopped after checkpoint phase {p}, {phase}; the user continues it in the viewer",
    "from_doc_again": "doc {doc} is already plan {n}",
    "from_doc_none": "doc {doc} has no parts titled \"Phase …\", so there are no phases to take; "
                     "write the plan with journal plans add and journal plans phase",
    "from_doc_body": "Made from doc {doc}. The doc is left as it was.",
    "from_doc": "plan {n}: a draft made from doc {doc}, with {phases} phase(s) and {todos} to-do(s) placed by the doc part they cite\n"
                "  read it with journal plans show {n}; the user approves it in the viewer",
    "progress": "{done} of {total} phase(s) complete",
    "current": "phase {p} current: {title}",
    "show": "PLAN {n}  {title}  ({status})\n  goal: {goal}\n  {meta}[\n  links: {refs}]",
    "phase_line": "  {mark} {p}  {title}[ — complete when {when}]{checkpoint}",
    "checkpoint_mark": "  (checkpoint)",
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
            phase.pop("announced_at", None)
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


def active(root: Path, track: str, known: dict[int, dict] | None = None) -> tuple[int, dict, list[dict]] | None:
    """(number, plan, its phases) of the active plan on this environment, or None."""
    known = _todos(root, track) if known is None else known
    for n, plan in enumerate(_all(root, track), 1):
        rows = phases(root, plan, track, known)
        if status(plan, rows) == ACTIVE:
            return n, plan, rows
    return None


def checkpoint(plan: dict, rows: list[dict], auto: bool = False) -> dict | None:
    """A complete checkpoint phase before the current one that the user has not continued past.

    ONE AUTO SWITCH, THE ENVIRONMENT'S. `auto` is that flag, passed in by every caller: with it on
    the agent goes on past a checkpoint (the phase still marks and still notifies), with it off the
    plan stops there and waits. A plan used to carry its own auto field, which could disagree with
    the environment's — a plan ran past its checkpoints while the list itself was not being worked.
    """
    now = current(plan, rows)
    if now is None or auto:
        return None
    for row, ph in zip(rows, plan.get("phases") or []):
        if row["p"] >= now["p"]:
            break
        if row["checkpoint"] and not ph.get("continued_at"):
            return row
    return None


def order(root: Path, track: str, items: list[dict]) -> list[tuple[int, dict]]:
    """(rank, to-do) for what auto may pick: the current phase (0), then to-dos in no plan above default priority (1)."""
    got = active(root, track)
    member = membership(root, track)
    if got is None:
        # a draft's to-dos wait for the user to approve the plan
        return [(0, t) for t in items if t["n"] not in member]
    n, plan, rows = got
    now, held = current(plan, rows), checkpoint(plan, rows, todo.auto(root, track))
    out = []
    for t in items:
        where = member.get(t["n"])
        if where is None:
            if todo.priority_of(t) > todo.DEFAULT_PRIORITY:
                out.append((1, t))
        elif where == (n, now["p"]) and not held:
            out.append((0, t))
    return out


def stall(root: Path, track: str) -> str:
    """Why the active plan gives auto nothing to pick up: a checkpoint, or a current phase with no to-dos; else ""."""
    got = active(root, track)
    if got is None:
        drafts = [m for m, plan in enumerate(_all(root, track), 1)
                  if (plan.get("status") or DRAFT) == DRAFT and any(ph.get("todos") for ph in plan.get("phases") or [])]
        return say("stall_draft", n=drafts[0]) if drafts else ""
    n, plan, rows = got
    held = checkpoint(plan, rows, todo.auto(root, track))
    if held:
        return say("stall_checkpoint", n=n, p=held["p"], title=held["title"])
    now = current(plan, rows)
    return say("stall_empty", n=n, p=now["p"], title=now["title"]) if not now["todos"] else ""


def proceed(root: Path, n: int, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """The user's word to go on past a checkpoint phase."""
    if source != "web" and approval(root) != "agent":
        return False, say("continue_user")
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        held = checkpoint(plan, phases(root, plan, here), todo.auto(root, here))
        if held is None:
            return False, say("no_checkpoint", n=n)
        plan["phases"][held["p"] - 1]["continued_at"] = at
        _put(root, items, here)
    return True, say("continued", n=n, p=held["p"], title=held["title"])


def announce(root: Path, track: str, at: str) -> None:
    """Tell the user once when a phase of an active plan completes."""
    import notifications
    with state.locked(root):
        items = _all(root, track)
        known = _todos(root, track)
        told = []
        for n, plan in enumerate(items, 1):
            if plan.get("status") != ACTIVE:
                continue
            for row, ph in zip(phases(root, plan, track, known), plan.get("phases") or []):
                if row["complete"] and not ph.get("announced_at"):
                    ph["announced_at"] = at
                    told.append((n, row))
            # the plan is done the moment its last phase completes: stamped once, so it can stay listed a while
            rows = phases(root, plan, track, known)
            if rows and all(r["complete"] for r in rows) and not plan.get("done_at"):
                plan["done_at"] = at
                told.append((0, None))
        if told:
            _put(root, items, track)
    for n, row in told:
        if row is None:
            continue
        notifications.add(root, say("phase_note", n=n, p=row["p"], title=row["title"]), at, f"plan {n}", "journal", track)


def carry_line(root: Path, track: str) -> str:
    """The active plan, for the block a session start hands over; "" when there is none."""
    got = active(root, track)
    if got is None:
        return ""
    n, plan, rows = got
    held = checkpoint(plan, rows, todo.auto(root, track))
    if held:
        return say("carry_held", n=n, title=plan.get("title", ""), p=held["p"], phase=held["title"])
    now = current(plan, rows)
    return say("carry", n=n, title=plan.get("title", ""), p=now["p"], total=len(rows), phase=now["title"], when=now["when"] or None)


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


def reads_like_plan(doc: dict) -> bool:
    """A doc titled like a plan, or with parts titled "Phase …"."""
    import docs
    return bool(docs._PLAN_WORDS.search(doc.get("title", ""))) or any(
        _PHASE_PART.match(p.get("title", "")) for p in doc.get("parts") or [])


def made_from_docs(root: Path) -> set[int]:
    """Doc numbers some environment already turned into a plan that is not abandoned."""
    import tracks
    return {plan["from_doc"] for name in tracks._all(root) for plan in _all(root, name)
            if plan.get("from_doc") and plan.get("status") != ABANDONED}


def from_doc(root: Path, ref: str, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """A draft plan from a doc: its "Phase …" parts become phases, holding the to-dos that cite them."""
    import docs
    here = _here(root, track)
    doc, _, err = docs.get(root, str(ref or "").strip())
    if doc is None:
        return False, err
    for m, plan in enumerate(_all(root, here), 1):
        if plan.get("from_doc") == doc["n"] and plan.get("status") != ABANDONED:
            return False, say("from_doc_again", doc=doc["n"], n=m)
    phased = [(p, (got.group(1).strip() or p["title"])) for p in doc.get("parts") or []
              for got in [_PHASE_PART.match(p.get("title", ""))] if got]
    if not phased:
        return False, say("from_doc_none", doc=doc["n"])
    member = membership(root, here)
    cited: dict[int, list[int]] = {}
    for t in todo._all(root, here):
        base, _, p = str(t.get("doc") or "").partition(".")
        if base == str(doc["n"]) and p.isdigit() and t["n"] not in member:
            cited.setdefault(int(p), []).append(t["n"])
    rows = [{"title": title, "when": "", "checkpoint": False, "todos": sorted(cited.get(p["p"], [])), "at": at}
            for p, title in phased]
    with state.locked(root):
        items = _all(root, here)
        items.append({"title": doc.get("title", ""), "goal": " ".join((doc.get("abstract") or doc.get("title", "")).split()),
                      "body": say("from_doc_body", doc=doc["n"]), "status": DRAFT, "at": at, "source": source,
                      "phases": rows, "refs": [f"doc {doc['n']}"], "from_doc": doc["n"]})
        _put(root, items, here)
        n = len(items)
    return True, say("from_doc", n=n, doc=doc["n"], phases=len(rows), todos=sum(len(r["todos"]) for r in rows))


def linked_reports(root: Path, track: str) -> set[int]:
    """Report numbers a plan that is not finished links: kept listed and never removed while it runs."""
    known = _todos(root, track)
    out = set()
    for plan in _all(root, track):
        if status(plan, phases(root, plan, track, known)) in (DONE, ABANDONED):
            continue
        out |= {int(ref.split()[1]) for ref in plan.get("refs") or [] if ref.startswith("report ")}
    return out


def row_response(root: Path, n: int, plan: dict, track: str, full: bool = False) -> dict:
    rows = phases(root, plan, track)
    now, held = current(plan, rows), checkpoint(plan, rows, todo.auto(root, track))
    row = {"n": n, "title": plan.get("title", ""), "goal": plan.get("goal", ""), "status": status(plan, rows),
           "at": plan.get("at", ""), "age": age(plan.get("at", "")) if plan.get("at") else "",
           "refs": list(plan.get("refs") or []), "why": plan.get("why") or "",
           "phases_total": len(rows), "phases_done": sum(1 for r in rows if r["complete"]),
           "current": now["p"] if now else None, "current_title": now["title"] if now else "",
           "held": held["p"] if held else None, "auto": todo.auto(root, track), "from_doc": plan.get("from_doc") or None,
           "closed_at": plan.get("done_at") or plan.get("closed_at") or "", "gist": fmt.gist(plan.get("goal", ""))}
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
                         checkpoint=say("checkpoint_mark") if ph["checkpoint"] else ""))
        lines.extend(say("todo_line", mark="[x]" if t["done"] else "[ ]", t=t["n"], title=t["title"] or "(archived)")
                     for t in ph["todos"])
        if not ph["todos"]:
            lines.append(say("no_todos_yet"))
    if d.get("body"):
        lines.extend(["", fmt.prose(d["body"])])
    return "\n".join(lines)
