from __future__ import annotations

import re
from pathlib import Path

import fmt
import state
import todo
from pins import age
from templates import render

KEY = "plans"
PREPARING, DRAFT, ACTIVE, PARKED, DONE, ABANDONED = "preparing", "draft", "active", "parked", "done", "abandoned"
#: project-wide: "user" (default) lets only the viewer activate a plan, "agent" lets the CLI do it too
APPROVAL = "plans_approval"

_PHASE_PART = re.compile(r"^\s*phase\s*\d*\s*[:.\-–—]?\s*(.*)$", re.I)

_REF = re.compile(r"^\s*(docs?|reports?|transcripts?)\s*[:#\s]?\s*(\d+(?:\.\d+)?)\s*$", re.I)

MESSAGES = {
    "needs_title": 'a plan needs a title: journal plans add "<title>" --goal="<what is true when it is done>" --brief',
    "needs_goal": 'a plan needs its goal, one line saying what is true when it is done: --goal="<goal>"',
    "added": 'plan {n}: {title} ({state})\n  add its phases: journal plans phase {n} "<title>" --when="<what is true when it is complete>"[\n  {tail}]',
    "added_preparing": 'it is being written: nobody can approve it until `journal plans ready {n}`, which refuses while a phase has no to-dos',
    "no_plan": "there is no plan {n}. `journal plans` numbers them.",
    "phase_is_a_date": ('{title} says WHEN, not WHAT. A phase is an area of work — name it so that '
                        '"is this phase done?" has an answer:\n'
                        '  journal plans phase <n> "the loader and its tests" --when="the double fetch is gone"'),
    "phase_title": 'a phase needs a title: journal plans phase {n} "<title>" --when="<what is true when it is complete>"',
    "closed": "plan {n} is {status} and takes no more changes",
    "phase_added": "plan {n} phase {p}: {title}\n  put to-dos in it: journal plans todos {n} {p} <to-do numbers>",
    "phase_inserted": "plan {n} phase {p}: {title}\n  the phases after it moved along, with their to-dos\n"
                      "  put to-dos in it: journal plans todos {n} {p} <to-do numbers>",
    "no_phase_here": "plan {n} has no phase {p} to go before; it has {last}",
    "no_phase": "plan {n} has no phase {p}",
    "phase_nothing": 'say what to change: journal plans rephrase {n} {p} "<title>" or --when= or --checkpoint/--no-checkpoint',
    "phase_changed": "plan {n} phase {p}: {title}{said}",
    "phase_said_when": "\n  complete when {when}",
    "phase_said_checkpoint": "\n  it is a checkpoint: the agent stops there and you continue the plan in the viewer",
    "phase_said_plain": "\n  it is no longer a checkpoint",
    "phase_held": "plan {n} is stopped at phase {p} right now — taking its checkpoint off starts the plan moving again",
    "phase_passed": "plan {n} has already run past phase {p}, so making it a checkpoint changes nothing that has happened",
    "todos_usage": "name the to-dos by number: journal plans todos {n} {p} 4 5 6",
    "no_todo": "there is no to-do {t} on this environment",
    "in_phase": "to-do {t} is already in plan {plan} phase {p}, and a to-do sits in one phase. "
                "Move it here in one command: journal plans todos {n} {here} {t} --move",
    "in_other_plan": "to-do {t} is in plan {plan}, not plan {n}; --move moves a to-do between the phases of its own plan",
    "moved": "plan {n} phase {p}: to-do(s) {todos} moved here from phase {was}",
    "phase_done": 'plan {n} phase {p} is complete; adding a to-do reopens it, so say why: --reopen="<why>"',
    "put": "plan {n} phase {p}: to-do(s) {todos} added",
    "taken": "plan {n} phase {p}: to-do(s) {todos} taken out",
    "not_in": "to-do {t} is not in plan {n} phase {p}",
    "user_activates": "only the user activates a plan: they approve plan {n} in the viewer",
    "no_phases": "plan {n} has no phases yet",
    "first_empty": "plan {n} cannot start: its first phase has no to-dos",
    "phase_empty": "plan {n} is not finished being written: phase {p}, {title}, has no to-dos yet. Break it down with "
                   "`journal todos add \"<title>\" --brief` and `journal plans todos {n} {p} <numbers>`",
    "one_active": "plan {other} is already active on this environment, and one plan is active at a time",
    "not_draft": "plan {n} is {status}, not a draft",
    "preparing": "plan {n} is being written: its phases are still being added",
    "not_preparing": "plan {n} is {status}, not one being written",
    "ready": "plan {n} is ready for the user to approve: {title}",
    "edited": "plan {n}: {said:; }",
    "edited_title": "titled {title}",
    "edited_goal": "goal — {goal}",
    "edited_body": "the approach is rewritten",
    "edit_nothing": 'nothing to change on plan {n}: pass a title, --goal="<what is true when it is done>" or --brief',
    "park_why": 'say why it is set aside: journal plans park {n} "<why>"',
    "park_not_active": "plan {n} is {status}; only the plan being worked can be parked",
    "parked": "plan {n} is parked: {why}\n  its to-dos stop being offered and another plan can run; `journal plans activate {n}` picks it up again",
    "resumed": "plan {n} is active again; phase {p}, {title}, is current",
    "activated": "plan {n} is active; phase 1, {title}, is current",
    "abandon_why": 'say why: journal plans abandon {n} "<why>"',
    "already_abandoned": "plan {n} is already abandoned",
    "abandoned": "plan {n} is abandoned: {why}",
    "not_a_ref": "{text} is not something a plan links; write `doc 4`, `doc 4.2` or `report 1`",
    "no_transcript": "message {n} carries no transcript",
    "no_report": "there is no report {n} on this environment",
    "linked": "plan {n} links {ref}",
    "already_linked": "plan {n} already links {ref}",
    "stall_checkpoint": "plan {n} stopped after phase {p}, {title}: it is a checkpoint, and the user continues the plan in the viewer",
    "stall_empty": "plan {n} phase {p}, {title}, is current and has no to-dos: break it down with `journal todos add` "
                   "and `journal plans todos {n} {p} <numbers>`",
    "stall_draft": "plan {n} is a draft: its to-dos wait until the user approves it in the viewer",
    # THE ONE REASON THAT MATTERS WAS THE ONE NOT NAMED. A current phase whose rows all exist but are
    # every one of them held fell through to the generic "nothing to pick up" tally, where the plan was
    # invisible — reported from another project against 1.141.0.
    "stall_held": "plan {n} cannot advance: {count} in phase {p}, {title}, {verb} held — {rows:; }[; {more}]",
    "stall_count_one": "its one to-do",
    "stall_count_many": "all {n} to-dos",
    "stall_more": "`journal todo` shows the rest",
    "stall_row_blocked": "to-do {n} is set aside ({why})",
    "stall_row_asking": "to-do {n} waits on your answer",
    "stall_row_after": "to-do {n} waits on to-do {nums:, }",
    "stall_row_assigned": "to-do {n} is held by an agent still working",
    "stall_row_reported": "to-do {n} is reported finished, yours to close with `journal todos done {n}`",
    "stall_row_other": "to-do {n} cannot be started",
    "stall_parked": "plan {n} is parked: {why}. Its to-dos wait until it is picked up again — `journal plans activate {n}`",
    "continue_user": "only the user continues a plan past a checkpoint: they do it in the viewer",
    "no_checkpoint": "plan {n} is not stopped at a checkpoint",
    "continued": "plan {n} continues past phase {p}, {title}",
    "ack_user": "only the user acknowledges a finished plan: they do it in the viewer",
    "not_finished": "plan {n} is not finished yet",
    "already_ack": "plan {n} was already acknowledged",
    "acknowledged": "plan {n} is acknowledged: {title}",
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
        # a phase became complete when its LAST to-do closed, which is the moment a checkpoint began to hold;
        # derived rather than stored, so it is right for plans written before anyone thought to record it
        closed = [(known.get(t) or {}).get("done") or "" for t in ph.get("todos") or []]
        out.append({"p": p, "title": ph.get("title", ""), "when": ph.get("when", ""), "checkpoint": bool(ph.get("checkpoint")),
                    "todos": rows, "complete": bool(rows) and all(r["done"] for r in rows), "current": False,
                    "completed_at": max(closed) if closed and all(closed) else ""})
    return out


def status(plan: dict, rows: list[dict]) -> str:
    stored = plan.get("status") or DRAFT
    if stored == ACTIVE and rows and all(r["complete"] for r in rows):
        return DONE
    return stored


def park(root: Path, n: int, why: str, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """Set the plan being worked aside, without finishing it and without saying it was dropped.

    A PLAN HAD NOWHERE TO WAIT. The states were draft, active, done and abandoned, and only one plan
    could be active — so a plan that was started and then had to wait could only be finished, which is
    a lie, or abandoned, which says it was dropped. Parking is the same act `work park` already names
    for a piece of work: it stays, it says why, and it is picked up again by activating it.

    IT FREES THE SLOT. `active()` finds a plan by its derived status, so a parked plan is no longer
    active: another plan may be activated, and this one's to-dos leave `order()` on their own, with
    nothing to remember and nothing to undo.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, say("park_why", n=n)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        got = status(plan, phases(root, plan, here))
        if got != ACTIVE:
            return False, say("park_not_active", n=n, status=got)
        plan.update(status=PARKED, parked_at=at, parked_why=why, parked_by=source)
        _put(root, items, here)
    return True, say("parked", n=n, why=why)


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
        preparing: bool = False, track: str | None = None) -> tuple[bool, str]:
    title, goal = " ".join((title or "").split()), " ".join((goal or "").split())
    if not title:
        return False, say("needs_title")
    import titles
    named, why = titles.check(title, "plan")
    if not named and not preparing:
        return False, why
    if not goal:
        return False, say("needs_goal")
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        items.append({"title": title, "goal": goal, "body": (body or "").strip(),
                      "status": PREPARING if preparing else DRAFT, "at": at,
                      "source": source, "phases": [], "refs": []})
        _put(root, items, here)
        n = len(items)
    return True, say("added", n=n, title=title, state=PREPARING if preparing else DRAFT,
                     tail=say("added_preparing", n=n) if preparing else None)


def edit(root: Path, n: int, title: str | None = None, goal: str | None = None, body: str | None = None,
         track: str | None = None) -> tuple[bool, str]:
    """Correct a plan's title, goal or approach. What is not given stays.

    THE GOAL IS THE ONE LINE THE PLAN IS JUDGED AGAINST, and until now it was frozen at creation —
    while the way a plan is meant to be written makes it provisional on purpose: the skill says shape
    the goal WITH the user, and the viewer opens a plan as `preparing` with a placeholder so it is
    visible while being shaped. Both routes produced a goal that had to be corrected and could not be.

    A DONE OR ABANDONED PLAN IS THE RECORD OF WHAT WAS DONE, so it refuses, exactly as a phase does.
    """
    here = _here(root, track)
    said = []
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        closed = _open_for_changes(root, plan, n, here)
        if closed:
            return False, closed
        if title is not None:
            title = " ".join(title.split())
            if not title:
                return False, say("needs_title")
            import titles
            named, why = titles.check(title, "plan")
            if not named:
                return False, why
            plan["title"] = title
            said.append(say("edited_title", title=title))
        if goal is not None:
            goal = " ".join(goal.split())
            if not goal:
                return False, say("needs_goal")
            plan["goal"] = goal
            said.append(say("edited_goal", goal=goal))
        if body is not None:
            plan["body"] = body.strip()
            said.append(say("edited_body"))
        if not said:
            return False, say("edit_nothing", n=n)
        _put(root, items, here)
    return True, say("edited", n=n, said=said)


#: a title that names WHEN rather than WHAT: a weekday, a date, or a stretch of time
_DATE_TITLE = re.compile(
    r"^(?:(?:mon|tues|wednes|thurs|fri|satur|sun)day|today|tomorrow|tonight|this (?:morning|afternoon|evening|week)"
    r"|next (?:week|month|day)|day \d+|week \d+|phase \d+"
    r"|the (?:next|first|last) (?:\w+ )?(?:minutes?|hours?|days?|weeks?|months?|mornings?|afternoons?|evenings?)"
    r"|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)$", re.I)


def _is_a_date(title: str) -> bool:
    return bool(_DATE_TITLE.match(title.strip().rstrip(".")))


def add_phase(root: Path, n: int, title: str, when: str, at: str, checkpoint: bool = False,
              track: str | None = None, before: int = 0) -> tuple[bool, str]:
    """A phase, at the end or `before` an existing one.

    APPEND-ONLY WAS A REAL COST, PAID ONCE. A plan is written before the work is understood, so the
    phase that turns out to belong in the middle is the ordinary case, not the exception — and with
    only an append the choice was to put its rows in a phase that does not describe them or to abandon
    the plan and write it again. Both happened here; the second is what this ends.

    Nothing has to be renumbered: a phase's number is its position, its to-dos live inside it, and
    every reader — `current`, `checkpoint`, `membership`, `reachable` — derives that position by
    enumerating. So an insert moves the later phases along and they carry everything with them.
    """
    title = " ".join((title or "").split())
    if not title:
        return False, say("phase_title", n=n)
    # A PHASE IS AN AREA OF WORK, NOT A SLOT IN THE WEEK. "Tuesday" and "the next two hours" are not
    # phases: nothing in them says what is true when the phase is done, which is the one question a
    # phase has to be able to answer.
    if _is_a_date(title):
        return False, say("phase_is_a_date", title=title)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        closed = _open_for_changes(root, plan, n, here)
        if closed:
            return False, closed
        phases = plan.setdefault("phases", [])
        if before and not 1 <= before <= len(phases):
            return False, say("no_phase_here", n=n, p=before, last=len(phases))
        row = {"title": title, "when": " ".join((when or "").split()),
               "checkpoint": bool(checkpoint), "todos": [], "at": at}
        p = before if before else len(phases) + 1
        phases.insert(p - 1, row)
        _put(root, items, here)
    return True, say("phase_inserted" if before else "phase_added", n=n, p=p, title=title)


def rephrase(root: Path, n: int, p: int, at: str, title: str = "", when: str = "",
             checkpoint: bool | None = None, track: str | None = None) -> tuple[bool, str]:
    """Correct a phase after it is written: its title, what completes it, whether it is a checkpoint.

    A PLAN IS WRITTEN BEFORE THE WORK IS UNDERSTOOD, which is the same argument that put `--before` on
    `phase`. A phase whose title turned out wrong, or whose `--when` cannot be judged true or false,
    could only be lived with — and the way people live with it is to abandon the plan and write it
    again, which costs the user a second approval for no new decision.

    THE CHECKPOINT IS THE ONE THAT CHANGES WHAT IS HAPPENING, so it says so. Taking one off a phase the
    plan is stopped at sets the plan moving; putting one on a phase already run past changes nothing.
    Both are allowed and both are named, because a silent change to whether the agent stops is the
    thing nobody would look for.
    """
    title = " ".join((title or "").split())
    when = " ".join((when or "").split())
    if not title and not when and checkpoint is None:
        return False, say("phase_nothing", n=n, p=p)
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        closed = _open_for_changes(root, plan, n, here)
        if closed:
            return False, closed
        steps = plan.get("phases") or []
        if not 1 <= p <= len(steps):
            return False, say("no_phase", n=n, p=p)
        rows = phases(root, plan, here)
        was_held = checkpoint is False and _is_held(root, plan, rows, p)
        passed = checkpoint is True and rows[p - 1]["complete"]
        phase = steps[p - 1]
        if title:
            phase["title"] = title
        if when:
            phase["when"] = when
        if checkpoint is not None:
            phase["checkpoint"] = bool(checkpoint)
        phase["changed_at"] = at
        _put(root, items, here)
        said = phase["title"]
    note = ""
    if when:
        note += say("phase_said_when", when=when)
    if checkpoint is True:
        note += say("phase_said_checkpoint")
    elif checkpoint is False:
        note += say("phase_said_plain")
    if was_held:
        note += "\n  " + say("phase_held", n=n, p=p)
    if passed:
        note += "\n  " + say("phase_passed", n=n, p=p)
    return True, say("phase_changed", n=n, p=p, title=said, said=note)


def _is_held(root: Path, plan: dict, rows: list[dict], p: int) -> bool:
    """Is the plan stopped at THIS phase's checkpoint right now?"""
    held = checkpoint(plan, rows, todo.auto(root))
    return bool(held and held["p"] == p)


def put_todos(root: Path, n: int, p: int, numbers, at: str, off: bool = False, reopen: str = "",
              move: bool = False, track: str | None = None) -> tuple[bool, str]:
    """Put to-dos in a phase, or take them out with `off`. A to-do sits in one phase of one plan.

    `move` IS THE ONE-COMMAND CORRECTION. A row in the wrong phase is the ordinary case — the
    plan was written before the work was understood — and taking it out of one phase and
    putting it in another was two commands, which is two chances to leave it in neither.
    """
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
        came_from = []
        for t in wanted:
            if t not in member or member[t] == (n, p):
                continue
            if not move:
                return False, say("in_phase", t=t, plan=member[t][0], p=member[t][1], n=n, here=p)
            if member[t][0] != n:
                return False, say("in_other_plan", t=t, plan=member[t][0], n=n)
            was = member[t][1]
            before = plan["phases"][was - 1]
            before["todos"] = [x for x in before.get("todos") or [] if x != t]
            came_from.append((t, was))
        fresh = [t for t in wanted if t not in held]
        if phases(root, plan, here, known)[p - 1]["complete"] and fresh:
            why = " ".join((reopen or "").split())
            if not why:
                return False, say("phase_done", n=n, p=p)
            phase.setdefault("reopened", []).append({"at": at, "why": why, "todos": fresh})
            phase.pop("announced_at", None)
        held.extend(fresh)
        _put(root, items, here)
    if came_from:
        return True, say("moved", n=n, p=p, todos=", ".join(str(t) for t, _ in came_from),
                         was=", ".join(str(w) for _, w in came_from))
    return True, say("put", n=n, p=p, todos=", ".join(map(str, wanted)))


def ready(root: Path, n: int, at: str, track: str | None = None) -> tuple[bool, str]:
    """The agent says the plan it was writing is finished and the user may approve it.

    A PLAN BEING WRITTEN IS NOT A PLAN WAITING. Between `plans add` and the last phase landing, a plan
    had one state with a plan that was finished and waiting — so the card said "ready to start" and the
    user could start something with no phases in it. The agent states when it is done rather than the
    code guessing from the phase count, because a plan abandoned half-written looks exactly the same
    from outside.
    """
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        rows = phases(root, plan, here)
        if (plan.get("status") or DRAFT) != PREPARING:
            return False, say("not_preparing", n=n, status=status(plan, rows))
        if not rows:
            return False, say("no_phases", n=n)
        empty = next((r for r in rows if not r["todos"]), None)
        if empty:
            return False, say("phase_empty", n=n, p=empty["p"], title=empty["title"])
        plan.update(status=DRAFT, ready_at=at)
        _put(root, items, here)
    return True, say("ready", n=n, title=plan.get("title", ""))


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
        was = plan.get("status") or DRAFT
        if was == PREPARING:
            return False, say("preparing", n=n)
        if was not in (DRAFT, PARKED):
            return False, say("not_draft", n=n, status=status(plan, rows))
        if not rows:
            return False, say("no_phases", n=n)
        if not rows[0]["todos"]:
            return False, say("first_empty", n=n)
        for other, it in enumerate(items, 1):
            if other != n and status(it, phases(root, it, here, known)) == ACTIVE:
                return False, say("one_active", other=other)
        plan.update(status=ACTIVE, activated_at=at, activated_by=source)
        if was == PARKED:
            plan.pop("parked_at", None), plan.pop("parked_why", None), plan.pop("parked_by", None)
        _put(root, items, here)
    if was == PARKED:
        now = current(plan, phases(root, plan, here))
        return True, say("resumed", n=n, p=(now or rows[0])["p"], title=(now or rows[0])["title"])
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


def reachable(plan: dict, rows: list[dict], now: dict, auto: bool) -> list[int]:
    """The phases auto may take from, in order: the current one, then each later one a checkpoint does not gate.

    A PHASE MUST NEVER WEDGE THE LIST. Every row in the current phase can be waiting on the
    user, blocked, or held by an agent, and then a plan that offered only that phase would
    leave auto with nothing to do while the list below it was full of work. So the later
    phases stay reachable — they are simply never picked while the current phase has
    something ready — and the only thing that really stops the run is a checkpoint the user
    has not continued past, which is what a checkpoint is for.
    """
    out = [now["p"]]
    for row, ph in zip(rows, plan.get("phases") or []):
        if row["p"] < now["p"]:
            continue
        if row["checkpoint"] and not (auto or ph.get("continued_at")):
            break
        if row["p"] > now["p"]:
            out.append(row["p"])
    return out


def order(root: Path, track: str, items: list[dict]) -> list[tuple[int, dict]]:
    """(rank, to-do) for what auto may pick: the earliest reachable phase with something ready (0),
    then to-dos in no plan above default priority (1)."""
    got = active(root, track)
    member = membership(root, track)
    if got is None:
        # a draft's to-dos wait for the user to approve the plan
        return [(0, t) for t in items if t["n"] not in member]
    n, plan, rows = got
    auto = todo.auto(root)
    now, held = current(plan, rows), checkpoint(plan, rows, auto)
    allowed = [] if held or now is None else reachable(plan, rows, now, auto)
    out, by_phase = [], {}
    for t in items:
        where = member.get(t["n"])
        if where is None:
            if todo.priority_of(t) > todo.DEFAULT_PRIORITY:
                out.append((1, t))
        elif where[0] == n and where[1] in allowed:
            by_phase.setdefault(where[1], []).append(t)
    # the earliest phase that has something ready: a later phase is worked only when the current one cannot be
    if by_phase:
        out.extend((0, t) for t in by_phase[min(by_phase)])
    return out


#: how many held rows a stalled plan names before it points at the list instead
STALL_ROWS = 3


def stall(root: Path, track: str) -> str:
    """Why the active plan gives auto nothing to pick up: a checkpoint, or a current phase with no to-dos; else ""."""
    got = active(root, track)
    if got is None:
        # A PARKED PLAN IS WHY THE LIST WENT QUIET, and saying nothing would leave `next` unexplained
        parked = [m for m, plan in enumerate(_all(root, track), 1) if (plan.get("status") or DRAFT) == PARKED]
        if parked:
            held = _all(root, track)[parked[0] - 1]
            return say("stall_parked", n=parked[0], why=held.get("parked_why") or "set aside")
        drafts = [m for m, plan in enumerate(_all(root, track), 1)
                  if (plan.get("status") or DRAFT) == DRAFT and any(ph.get("todos") for ph in plan.get("phases") or [])]
        return say("stall_draft", n=drafts[0]) if drafts else ""
    n, plan, rows = got
    held = checkpoint(plan, rows, todo.auto(root))
    if held:
        return say("stall_checkpoint", n=n, p=held["p"], title=held["title"])
    now = current(plan, rows)
    if not now["todos"]:
        return say("stall_empty", n=n, p=now["p"], title=now["title"])
    # THE PLAN GIVES AUTO NOTHING WHEN NO REACHABLE PHASE HAS A READY ROW. `order` is the wrong question
    # to ask here: it decides what auto may take by phase and priority, and a blocked row is still in it.
    # Readiness is what decides whether anything can actually start.
    open_rows = todo.open_items(root, track)
    can_start = {t["n"] for t in todo.ready(root, track)}
    if any(rank == 0 and t["n"] in can_start for rank, t in order(root, track, open_rows)):
        return ""
    member = membership(root, track)
    held = [t for t in open_rows if member.get(t["n"]) == (n, now["p"])]
    if not held:
        return ""
    # a long phase would run the line away: name the first few and point at the list for the rest
    shown = held[:STALL_ROWS]
    return say("stall_held", n=n, p=now["p"], title=now["title"],
               count=say("stall_count_one") if len(held) == 1 else say("stall_count_many", n=len(held)),
               verb="is" if len(held) == 1 else "are",
               rows=[_why_held(root, track, t) for t in shown],
               more=say("stall_more") if len(held) > len(shown) else None)


def _why_held(root: Path, track: str, t: dict) -> str:
    """Why this one row cannot be started, in the order that decides what happens to it next."""
    n = t["n"]
    if t.get("asks") and not t.get("answer"):
        return say("stall_row_asking", n=n)
    if t.get("reported"):
        return say("stall_row_reported", n=n)
    if t.get("assigned"):
        return say("stall_row_assigned", n=n)
    if t.get("blocked"):
        return say("stall_row_blocked", n=n, why=t["blocked"])
    if nums := todo.waiting_on(root, track, t):
        return say("stall_row_after", n=n, nums=nums)
    return say("stall_row_other", n=n)


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
        held = checkpoint(plan, phases(root, plan, here), todo.auto(root))
        if held is None:
            return False, say("no_checkpoint", n=n)
        plan["phases"][held["p"] - 1]["continued_at"] = at
        _put(root, items, here)
    return True, say("continued", n=n, p=held["p"], title=held["title"])


def acknowledged(plan: dict) -> bool:
    """Has the user seen that this plan finished? A plan that never finished needs no answer."""
    return bool(plan.get("acknowledged_at"))


def acknowledge(root: Path, n: int, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """The user's word that they have seen a finished plan — what takes its card off the home.

    A PLAN THAT FINISHES SHOULD NOT VANISH. The home card followed the ACTIVE plan, so the moment the
    last phase completed the plan derived as done and the card disappeared with nothing saying it had
    finished. The card stays until the user says they have seen it; this is that word, and like
    approving a plan or continuing past a checkpoint it is theirs, not the agent's.
    """
    if source != "web" and approval(root) != "agent":
        return False, say("ack_user")
    here = _here(root, track)
    with state.locked(root):
        items = _all(root, here)
        plan = _get(items, n)
        if plan is None:
            return False, say("no_plan", n=n)
        if status(plan, phases(root, plan, here)) != DONE:
            return False, say("not_finished", n=n)
        if acknowledged(plan):
            return False, say("already_ack", n=n)
        plan["acknowledged_at"] = at
        _put(root, items, here)
    return True, say("acknowledged", n=n, title=plan.get("title", ""))


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
    held = checkpoint(plan, rows, todo.auto(root))
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
    word = m.group(1).lower()
    kind = "doc" if word.startswith("doc") else "transcript" if word.startswith("transcript") else "report"
    # only a doc has parts, so only a doc has a dotted number
    if kind != "doc" and "." in m.group(2):
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
    elif kind == "transcript":
        import inbox
        if inbox.transcript(root, here, int(num)) is None:
            return False, say("no_transcript", n=num)
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
    now, held = current(plan, rows), checkpoint(plan, rows, todo.auto(root))
    row = {"n": n, "title": plan.get("title", ""), "goal": plan.get("goal", ""), "status": status(plan, rows),
           "at": plan.get("at", ""), "age": age(plan.get("at", "")) if plan.get("at") else "",
           "refs": list(plan.get("refs") or []), "why": plan.get("why") or "",
           "phases_total": len(rows), "phases_done": sum(1 for r in rows if r["complete"]),
           "current": now["p"] if now else None, "current_title": now["title"] if now else "",
           "held": held["p"] if held else None, "held_since": (held or {}).get("completed_at", ""),
           "held_age": age(held["completed_at"]) if held and held.get("completed_at") else "",
           "auto": todo.auto(root), "from_doc": plan.get("from_doc") or None,
           # a finished plan the user has not seen yet still belongs on the home card
           "acknowledged": acknowledged(plan), "acknowledged_at": plan.get("acknowledged_at") or "",
           "parked_why": plan.get("parked_why") or "", "parked_at": plan.get("parked_at") or "",
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
