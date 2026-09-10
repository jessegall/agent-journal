#: WHAT A TO-DO IS, IN PRIORITY ORDER, AND WHY THAT ORDER. Each row is a state and the
#: predicate that puts a to-do in it; the FIRST match wins. The order is load-bearing and
#: says so — a first draft of this table claimed the predicates could not overlap, and 237
#: of the 256 field combinations do. `blocked` and `started` are both true of a row that was
#: picked up and then set aside, and that is not a defect: what a reader needs is why it is
#: not moving NOW, which is the later fact.
#:
#: SO THE ORDER IS THE ANSWER TO ONE QUESTION, asked top to bottom: what is the most recent
#: thing that decides what happens to this row next?
#:
#:   done      it is over, and nothing below can change that
#:   answered  the user has spoken and nobody has picked it up — the most actionable row
#:             there is, which is why it outranks everything but being finished
#:   asks      nobody can move it: a question with no answer, and not picked up anyway
#:   reported  an agent says it is finished and only the parent may close it
#:   assigned  held for a live agent; nobody else may take it
#:   blocked   set aside on a condition the agent will re-judge
#:   after     a prerequisite has not landed
#:   started   in flight
#:   waiting   none of the above
#:
#: `asks` WAS HISTORY BEING READ AS STATE, and that was the bug. `ask()` records the question
#: and `answer()` the reply, and neither is ever cleared — correctly: the exchange is the
#: record of why this row is what it is. But the ladder tested `t["asks"]` bare, so any to-do
#: that had EVER been asked a question shadowed every state below it. A row could be picked
#: up, worked, and reported finished while still printing "waits on the user", for the rest
#: of the project. Found by a dogfood agent folding this listing into the shared one, which
#: preserved the behaviour and reported it rather than fixing it silently.
#:
#: The predicate is precise now instead of the order being clever: waiting on the user means
#: a question with NO answer and nobody has picked it up. Starting such a row is an agent
#: saying it will proceed without one, which is legitimate and used to be invisible.
"""Delayed work — what the agent should remember TO DO. Not a rule, not a pin, not in flight.

A pin is a claim, a rule binds, open work is in flight. None of them holds "do this later",
and a piece of work that is only remembered in a summary is a piece of work that is
forgotten at the next compaction. So a to-do is written down, and it is written as a FILE:
a to-do is a brief, not a claim, and when it is picked up in a week the reader needs what,
why and where to start, which is longer than one line. A file can be edited by hand and
read in a diff.

SCOPED TO THE ENVIRONMENT. A to-do belongs to the line of work that deferred it, and one environment's
debts do not bleed into another's: `todo/<environment>/NNN-<slug>.md`. The number is the file's,
stable for the life of the to-do, so "to-do 3" means the same thing after 2 is done.

SAID, NEVER HELD, AND NOT AT EVERY STOP. An idle agent told "three to-dos are waiting"
will start one; whether it should is the user's call. The line says so, and it is said once
per transcript and again only when the list has changed — a reminder at every idle stop is
wallpaper within the hour.
"""
from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import fmt
import state

DIR = "todo"
STRUCK = "struck"
FIELDS = ("title", "track", "at", "session", "line", "started", "done", "how", "asks", "answer",
          "blocked", "after", "assigned", "reported", "by", "doc", "reopened", "moved_from")


def _slug(text: str, limit: int = 40) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return (s[:limit].rstrip("-") or "untitled")


def folder(root: Path, track: str) -> Path:
    """Where this environment's to-dos live: inside the environment's own folder.

    They sat in a parallel `todo/<name>/` tree, which meant "what is on this environment"
    was answered in two places that could disagree. `migrate` moves an older layout across
    on the first run after an upgrade; the old path is still read until it has, so nothing
    is invisible in between.
    """
    d = state.env_dir(root, track) / DIR
    if not d.is_dir():
        was = root / DIR / _slug(state.slug(track) or "default", 60)
        if was.is_dir():
            return was
    return d


def _parse(path: Path) -> dict:
    text = path.read_text()
    meta: dict = {"title": "", "body": "", "path": path}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    meta["body"] = text.strip()
    m = re.match(r"(\d+)-", path.name)
    meta["n"] = int(m.group(1)) if m else 0
    if not meta["title"]:
        meta["title"] = path.stem
    return meta


def _write(path: Path, meta: dict, body: str) -> None:
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS] + ["---", ""]
    if body.strip():
        lines += [body.strip(), ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def _all(root: Path, track: str) -> list[dict]:
    d = folder(root, track)
    if not d.is_dir():
        return []
    return sorted((_parse(f) for f in d.glob("*.md")), key=lambda m: m["n"])


def open_items(root: Path, track: str) -> list[dict]:
    return [t for t in _all(root, track) if not t.get("done")]


def ready(root: Path, track: str) -> list[dict]:
    """Open to-dos nothing is waiting on: what auto may pick up. Answered first.

    TWO WAYS TO BE UNREADY AND THEY ARE NOT THE SAME. `asks` waits on a PERSON — somebody
    must answer, and the list surfaces it to them. `blocked` waits on a CONDITION — a batch
    that must run together, a release, another to-do — and nobody has to do anything; the
    agent re-judges it itself when it comes round again.

    THE SECOND ONE EXISTS BECAUSE ITS ABSENCE COST A REAL SESSION. With no way to say "not
    now, because X", an agent whose reminder forbade the work the list kept offering built
    a parking-bay environment, switched to it, and silenced every reminder it had — the
    list was a wall and it went around. A wall is what an agent routes around; a skip is
    what it uses.
    """
    # A ROW HELD BY A LIVE AGENT IS NOT READY FOR ANYONE ELSE. The hold lapses on a
    # heartbeat, so a dispatch that died releases its row without anybody remembering to.
    import agents as ag
    items = [t for t in open_items(root, track)
             if (not t.get("asks") or t.get("answer")) and not t.get("blocked")
             and not t.get("reported")
             and not (t.get("assigned") and ag.active(root, track, t["assigned"], 30))
             and not waiting_on(root, track, t)]
    return sorted(items, key=lambda t: 0 if answered_one(t) else 1)


def blocked(root: Path, track: str) -> list[dict]:
    """Open to-dos set aside on a condition, with the reason each is waiting on."""
    return [t for t in open_items(root, track) if t.get("blocked")]


def assign(root: Path, track: str, n: int, agent: str) -> tuple[bool, str]:
    """Hand a to-do to one named subagent. `--off` gives it back to the list.

    A HELD ROW IS NOT A LOCKED ONE. The hold means: while that agent is still writing, this
    is theirs to work and theirs alone. It lapses on a heartbeat rather than on a promise,
    because nothing can tell us a subagent died — see `agents.touch`.
    """
    import agents as ag
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    if agent in ("--off", "off", ""):
        was = t.get("assigned")
        if not was:
            return False, f"to-do {n} is assigned to nobody"
        _update(root, track, n, assigned="", reported="", by="")
        return True, f"to-do {n} is back on the list; it was held by `{was}`"
    agent = state.slug(agent)
    held = t.get("assigned")
    if held and held != agent:
        return False, (f"to-do {n} is held by `{held}` — one agent works a row. "
                       f'`journal assign {n} --off` takes it back first.')
    _update(root, track, n, assigned=agent)
    return True, (f"to-do {n} is assigned to `{agent}`: {t['title']}\n"
                  f"  it is theirs while they are writing; nobody else may take or complete it")


def report(root: Path, track: str, n: int, how: str, agent: str) -> tuple[bool, str]:
    """A subagent says a to-do is finished. Only the parent may CLOSE one.

    TWO PHASES, AND THE SECOND IS THE PARENT'S. A subagent that could close its own row
    would be marking its own homework — the failure this project already watched happen
    once, where a runner ticked its own box and the record read as done while a step was
    missed. So it reports, with how, and the close stays where the judgement is.
    """
    how = " ".join((how or "").split())
    if not how:
        return False, f'say how it was finished: `journal todos report {n} "<how>"`'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already closed ({t.get('how')})"
    if state.slug(agent) != (t.get("assigned") or ""):
        held = t.get("assigned")
        return False, (
            f"to-do {n} is not assigned to you — it is held by `{held}`. Report what you "
            "found instead." if held else
            f"to-do {n} is held by nobody, so there is nothing of yours to report. "
            f"`journal todos start {n} --as={state.slug(agent)}` claims it and starts it.")
    _update(root, track, n, reported=how, by=state.slug(agent))
    return True, (f"to-do {n} is reported finished: {how}\n"
                  "  the agent that dispatched you closes it; you are done with this row")


def reported(root: Path, track: str) -> list[dict]:
    """Rows a subagent has finished and the parent has not yet closed."""
    return [t for t in open_items(root, track) if t.get("reported")]


def after_of(t: dict) -> list[int]:
    """The to-do numbers this one must follow, as numbers."""
    raw = (t.get("after") or "").replace(",", " ").split()
    return [int(x) for x in raw if x.isdigit()]


def waiting_on(root: Path, track: str, t: dict) -> list[int]:
    """Which of this to-do's prerequisites are not done yet — [] when it is free to start.

    A PREREQUISITE IS A `blocked` WHOSE CONDITION THE CODE CAN CHECK. `blocked` is prose the
    agent re-judges; this is a list of numbers, so when the last one closes the row becomes
    ready ON ITS OWN and nobody has to remember to release it. That is the whole reason to
    have both.

    A STRUCK PREREQUISITE IS NOT A DONE ONE. It was abandoned, not finished, so the row that
    depended on it may no longer make sense — it stays waiting and `journal todos` says which
    number it is waiting on, rather than quietly becoming ready because the blocker vanished.
    """
    by_n = {x["n"]: x for x in _all(root, track)}
    return [n for n in after_of(t)
            if n in by_n and not (by_n[n].get("done") and not by_n[n].get("struck"))]


def asking(root: Path, track: str) -> list[dict]:
    """Open to-dos waiting on the user, each with its question, not yet answered."""
    return [t for t in open_items(root, track) if t.get("asks") and not t.get("answer")]


def answered_one(t: dict) -> bool:
    return bool(t.get("asks") and t.get("answer") and not t.get("started") and not t.get("done"))


def answered(root: Path, track: str) -> list[dict]:
    """To-dos the user has answered and nobody has picked up yet: the agent is unstuck."""
    return [t for t in open_items(root, track) if answered_one(t)]


def answer(root: Path, track: str, n: int, text: str) -> tuple[bool, str]:
    """The user's answer to a to-do's question, from the terminal, on the record.

    THE OTHER HALF OF `ask`. The agent parked a question; the user reads it in `journal
    todo` and answers here without opening a session. The to-do is ready again and goes
    first: the next stop tells the agent which question was answered and what the answer
    was, and hands it that to-do before any other.
    """
    text = " ".join((text or "").split())
    if not text:
        return False, 'say the answer: journal todos answer <n> "<the answer>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    if not t.get("asks"):
        return False, f"to-do {n} is not waiting on a question; `journal todos start {n}` picks it up"
    _update(root, track, n, answer=text)
    return True, f"answered to-do {n}: {t['title']}\n  the agent is told at its next stop and picks it up first"


def ask(root: Path, track: str, n: int, question: str) -> tuple[bool, str]:
    """Mark a to-do as waiting on the user, with the question it waits on.

    THE WAY AUTO SKIPS WITHOUT FORGETTING. An agent working through a list meets a to-do
    whose brief leaves a decision only the user can make. Without this it asks, the turn
    ends, and the next hold names the same to-do again — a loop with the user as the
    exit. With it the question is on the record, the hold names the next to-do that is
    not waiting, the start block shows the user what is waiting on them, and `start`
    picks it up once they have answered.
    """
    question = " ".join((question or "").split())
    if not question:
        return False, 'say what the user must decide: journal todos ask <n> "<the question>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, asks=question, started="")
    return True, f"to-do {n} waits on the user: {question}"


def block(root: Path, track: str, n: int, why: str) -> tuple[bool, str]:
    """Set a to-do aside on a condition. Not done, not abandoned, not the user's problem.

    THE REASON IS REQUIRED, like every retirement here — and unlike them this one is not a
    retirement at all: the to-do stays open, stays counted, and comes back. What the reason
    buys is a later reader knowing WHY a row was skipped rather than finding a gap, and the
    agent that meets it again reading the condition at the moment it is judging whether the
    condition still holds.

    IT IS THE AGENT'S OWN JUDGEMENT, exactly like a reminder's `--until`. Nothing here can
    evaluate "the rig batch has run"; the agent wrote it, the agent reads it back, and the
    agent unblocks it. `journal todos start <n>` does that in one move, deliberately: if
    you are picking it up, the block is over.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, ('say what it waits on: `journal todos block <n> "<what has to be true '
                       'first>"` — a skipped row with no reason reads as a gap')
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, blocked=why, started="")
    return True, (f"to-do {n} is set aside: {why}\n"
                  f"  the list skips it and `journal next` will not offer it; "
                  f"`journal todos start {n}` picks it up when the condition is true")


def after(root: Path, track: str, n: int, names: str) -> tuple[bool, str]:
    """Say which to-dos must land before this one. `--none` clears it.

    REFUSED RATHER THAN DISCOVERED. A dependency rots in ways a flat list cannot: a number
    that is not a to-do, a row waiting on itself, or a CYCLE — 12 after 14 after 12 — which
    is a list that can never be worked and whose only symptom is a `next` that returns
    nothing forever. All three are caught here, when they are written, because that is the
    only moment somebody is looking.
    """
    names = " ".join((names or "").replace(",", " ").split())
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if names in ("--none", "none", ""):
        _update(root, track, n, after="")
        return True, f"to-do {n} waits on nothing now"
    want = [x for x in names.split()]
    if any(not x.isdigit() for x in want):
        return False, f'a prerequisite is a to-do number: `journal todos after {n} 12,14`'
    nums = [int(x) for x in want]
    by_n = {x["n"]: x for x in _all(root, track)}
    missing = [x for x in nums if x not in by_n]
    if missing:
        return False, (f"no to-do on `{track}` is numbered {', '.join(map(str, missing))}; "
                       "`journal todos` numbers them")
    if n in nums:
        return False, f"to-do {n} cannot wait on itself"
    cycle = _cycle(by_n, n, nums)
    if cycle:
        return False, (f"that is a cycle: {' → '.join(map(str, cycle))} — a list where each "
                       "waits on the next can never be worked")
    _update(root, track, n, after=",".join(map(str, nums)))
    left = waiting_on(root, track, {**t, "after": ",".join(map(str, nums))})
    return True, (f"to-do {n} waits on {', '.join(map(str, nums))}"
                  + (f"; {len(left)} still open, and it becomes ready when the last one closes"
                     if left else " — all of them are done, so it is ready now"))


def _cycle(by_n: dict, start: int, nums: list[int]) -> list[int] | None:
    """The path back to `start`, if these prerequisites would close a loop."""
    seen, stack = set(), [(x, [start, x]) for x in nums]
    while stack:
        cur, path = stack.pop()
        if cur == start:
            return path
        if cur in seen:
            continue
        seen.add(cur)
        for nxt in after_of(by_n.get(cur, {})):
            stack.append((nxt, path + [nxt]))
    return None


def unblock(root: Path, track: str, n: int) -> tuple[bool, str]:
    """The condition came true. Also what `start` does, so picking one up is enough."""
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if not t.get("blocked"):
        return False, f"to-do {n} is not set aside"
    was = t["blocked"]
    _update(root, track, n, blocked="")
    return True, f"to-do {n} is back on the list; it was set aside on: {was}"


def _get(root: Path, track: str, n: int) -> tuple[dict | None, str]:
    items = {t["n"]: t for t in _all(root, track)}
    if n not in items:
        return None, f"there is no to-do {n} on environment `{track}`. `journal todo` numbers them."
    return items[n], ""


def add(root: Path, track: str, title: str, body: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Write one. Refuses an empty title and a duplicate open one."""
    title = " ".join((title or "").split())
    if not title:
        return False, 'a to-do needs a title: journal todos add "<what, in a few words>"'
    for t in open_items(root, track):
        if t["title"].lower() == title.lower():
            return False, f"already waiting as to-do {t['n']} — nothing to add"
    items = _all(root, track)
    n = (items[-1]["n"] if items else 0) + 1
    path = folder(root, track) / f"{n:03d}-{_slug(title)}.md"
    meta = {"title": title, "track": track, "at": at, **{k: str(v) for k, v in (where or {}).items()}}
    _write(path, meta, body)
    return True, f"to-do {n} on `{track}`: {title}\n  {path.relative_to(root.parent)}"


def _update(root: Path, track: str, n: int, **fields) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta.update({k: v for k, v in fields.items()})
    _write(t["path"], meta, t["body"])
    return {**t, **meta}, ""


_HEADING = re.compile(r"^##\s+(.+?)\s*$")


def _sections(body: str) -> list[tuple[str, str]]:
    """[(title, text)], in the order they appear in the body.

    A SECTION IS AN ATX `## <name>` HEADING plus everything up to the next one or the
    end of the file — level 2, deliberately, so it never collides with a `# <title>` a
    hand-written brief might already carry. The stretch before the first heading (most
    briefs, today) is title "". `text` includes its own heading line for a named
    section, so `"\\n".join(text for _, text in sections)` reproduces the body exactly —
    that is what `replace_section` relies on to touch only the one section it names.
    """
    lines = (body or "").split("\n")
    out: list[tuple[str, str]] = []
    title = ""
    buf: list[str] = []
    for line in lines:
        m = _HEADING.match(line)
        if m:
            out.append((title, "\n".join(buf)))
            title, buf = m.group(1).strip(), [line]
        else:
            buf.append(line)
    out.append((title, "\n".join(buf)))
    return out


def _snapshot(t: dict) -> Path:
    """Copy the whole file, unchanged, to struck/ before it is rewritten.

    A to-do has no per-part files to move individually the way a doc's part does, so the
    whole file is the snapshot. NOTHING IS EVER DELETED holds here too: the file named
    here is the pre-edit brief, in full, reachable after the edit that replaced it.
    """
    struck_dir = t["path"].parent / STRUCK
    struck_dir.mkdir(exist_ok=True)
    # MICROSECONDS, NOT SECONDS: two edits inside one automated run (a test, a script)
    # land inside the same second often enough that a coarser stamp would make the
    # second snapshot silently overwrite the first — the exact silent loss this whole
    # mechanism exists to prevent.
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    dst = struck_dir / f"{t['path'].stem}-{stamp}.md"
    dst.write_text(t["path"].read_text())
    return dst


def amend(root: Path, track: str, n: int, title: str, addition: str) -> tuple[bool, str]:
    """Append a NEW `## <title>` section to a brief. Mirrors `docs.part`.

    Refuses a title that already names a section — journal todos replace updates one of
    those — and refuses an empty addition, the same discipline `journal todos add`
    already applies to an empty title: a write that reports success and lands wrong is
    the one failure this project exists to prevent.
    """
    title = " ".join((title or "").split())
    if not title:
        return False, 'amend wants a section title: journal todos amend <n> "<section title>" --brief'
    addition = (addition or "").rstrip("\n")
    if not addition.strip():
        return False, "amend wants a body on stdin — pass it with --brief"
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if any(existing.lower() == title.lower() for existing, _ in _sections(t["body"]) if existing):
        return False, (f'to-do {n} already has a section called "{title}" — '
                        f'journal todos replace {n} "{title}" updates it')
    _snapshot(t)
    sep = "\n\n" if t["body"].strip() else ""
    new_body = t["body"].rstrip("\n") + sep + f"## {title}\n{addition}\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, f'to-do {n}: added section "{title}"\n  the old brief is kept under {STRUCK}/'


def replace_section(root: Path, track: str, n: int, title: str, new_text: str) -> tuple[bool, str]:
    """Replace ONE named section, byte-for-byte elsewhere; without a title, the whole
    body. Mirrors `docs.replace`. A title that names no section refuses and lists what
    the brief does have, rather than guessing or silently appending.
    """
    new_text = (new_text or "").rstrip("\n")
    if not new_text.strip():
        return False, "replace wants a body on stdin — pass it with --brief"
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    title = " ".join((title or "").split())
    sections = _sections(t["body"])
    if not title:
        _snapshot(t)
        _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_text + "\n")
        return True, f"to-do {n}: the whole brief replaced\n  the old one is kept under {STRUCK}/"
    named = [s for s in sections if s[0]]
    match = next((s for s in named if s[0].lower() == title.lower()), None)
    if match is None:
        have = ", ".join(f'"{s[0]}"' for s in named) or "none — this brief has no `## ` sections yet"
        return False, f'to-do {n} has no section called "{title}". It has: {have}'
    _snapshot(t)
    rebuilt = [f"## {title}\n{new_text}" if existing.lower() == title.lower() else text
               for existing, text in sections]
    new_body = "\n".join(rebuilt)
    if not new_body.endswith("\n"):
        new_body += "\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, f'to-do {n}: section "{title}" replaced\n  the old brief is kept under {STRUCK}/'


def start(root: Path, track: str, n: int, at: str, strict: bool = False,
          agent: str = "") -> tuple[dict | None, str]:
    """Pick a to-do up. An AGENT picking one up also claims it, through `assign`.

    PICKING IT UP IS CLAIMING IT, and the absence of that cost a dogfood run its report: a
    subagent ran `todos start 1`, worked the row, and was then refused by `report` with
    "held by `nobody`" — because `started` and `assigned` were two facts and only a
    dispatcher set the second. Nothing in the flow told it to assign itself, so the hold
    that `ready` checks was never taken and the row stayed offerable to anyone the whole
    time it was being worked.

    THE CLAIM GOES THROUGH `assign` RATHER THAN BESIDE IT. One funnel holds a row, so the
    refusal an agent gets for a row another live agent holds is the same sentence whichever
    door it came in by, and the lapse-on-heartbeat rule has one implementation.
    """
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    if t.get("done"):
        return None, f"to-do {n} is already done ({t.get('how') or 'no reason recorded'})"
    if strict and t.get("asks") and not t.get("answer"):
        # A DELEGATED ACTOR CANNOT REACH THE USER: what waits on them is not startable for
        # it. A session may start it — the user answered in the conversation.
        nxt = next((x for x in ready(root, track) if x["n"] != n), None)
        return None, (f"to-do {n} waits on the user: {t['asks']}" + (f" — next ready: {nxt['n']} ({nxt['title']})" if nxt
                      else " — nothing else is ready"))
    if agent:
        ok, why = assign(root, track, n, agent)
        if not ok:
            return None, why
    # PICKING IT UP ENDS THE BLOCK. A to-do set aside on a condition is being started, so
    # the condition is over by the only judgement that can decide it. The question and its
    # answer stay, as history.
    return _update(root, track, n, started=at, blocked="")


def done(root: Path, track: str, n: int, how: str, at: str) -> tuple[bool, str]:
    how = " ".join((how or "").split())
    if not how:
        return False, 'say how it was resolved: journal todos done <n> "<how>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, done=at, how=how)
    return True, f"done {n}: {t['title']}\n  {how}"


def move(root: Path, track: str, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Move a to-do to another environment, brief and all.

    THE FILE MOVES AND THE NUMBER CHANGES, because a to-do's number is its filename and the
    numbering is per environment. What it was is kept in `moved_from`, so a to-do named by
    an old message can still be found. Nothing is left behind: unlike a pin, a to-do is not
    re-asserted into anybody's context, so a tombstone would only be a second entry to read.
    """
    dst = state.slug(dst)
    if not dst:
        return False, 'say where: journal todos move <n> "<environment>"'
    if dst == state.slug(track):
        return False, f"to-do {n} is already on `{dst}`"
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    there = _all(root, dst)
    to = (there[-1]["n"] if there else 0) + 1
    meta = {k: t.get(k, "") for k in FIELDS}
    meta["track"] = dst
    meta["moved_from"] = f"{track}/{n}"
    path = folder(root, dst) / f"{to:03d}-{_slug(t['title'])}.md"
    _write(path, meta, t["body"])
    t["path"].unlink()
    return True, (f"to-do {n} on `{track}` is to-do {to} on `{dst}`: {t['title']}\n"
                  f"  {path.relative_to(root.parent)}")


def reopen(root: Path, track: str, n: int, why: str, at: str) -> tuple[bool, str]:
    """Undo a close, on the record.

    THE PRICE OF CLOSING A TO-DO AUTOMATICALLY. `done` is a field with no verb that cleared
    it, so a wrong number — a typo in a commit trailer, a close that fired on the wrong
    environment — could only be undone by hand-editing the markdown. Nothing that closes
    without a human in the loop should be that expensive to reverse. The reason is required
    and the old close is kept beside it, so a reopen is auditable rather than silent.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, 'say why it is open again: journal todos reopen <n> "<why>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if not t.get("done"):
        return False, f"to-do {n} is not done — nothing to reopen"
    was = t.get("how") or "no reason recorded"
    _update(root, track, n, done="", how="", reopened=f"{at} · {why} (was closed: {was})")
    return True, f"reopened {n}: {t['title']}\n  {why}\n  the close it undoes: {was}"


def titled(root: Path, track: str, title: str) -> dict | None:
    """The started to-do whose title is these words, if there is one. Reads, decides nothing.

    THE MATCH AND THE CLOSE ARE TWO QUESTIONS, and for a long time one function answered
    both. Ending work said whether a row existed AND marked it done in the same breath, so
    the only way to learn a row was about to close was to close it.
    """
    want = " ".join(title.split()).lower()
    return next((t for t in open_items(root, track)
                 if t["title"].lower() == want and t.get("started")), None)


def close_titled(root: Path, track: str, title: str, at: str,
                 agent: str = "") -> tuple[str, str]:
    """Close the to-do whose title these words are. ASKED FOR, never automatic.

    IT USED TO FIRE ON EVERY `work end` AND IT WAS WRONG 36 TIMES. In one real project 710
    of 1,810 closed rows — 39% — were closed by this and not by anyone deciding they were
    done; the 36 are only the ones an agent later noticed and reopened, in words that say
    exactly what happened: "parked on a Kit gap, not done — the work-end closed it", "closed
    by a work-end of the same name while I was filing, not by any implementation", "five of
    seven sites remain; the work end matched its title and closed it". One row had it happen
    twice.

    THE CAUSE WAS ONE MISSING DISTINCTION. `work end` meant both "this is finished" and "I
    am putting this down", because there was no verb for the second. An agent interrupted
    mid-row does the tidy thing — closes its declaration before switching — and the record
    heard "done". The user's ruling: closing a to-do is always explicit. `journal todos done
    <n>`, a `Journal: todos done <n>` commit trailer, or `work end "<subject>" --todo`, which
    is the one-command form and still says so out loud.

    A SUBAGENT CLOSES NOTHING, AND THIS IS THE DOOR IT WENT THROUGH. `report` refuses to
    close and says the parent does it; then `work end`, on the subject `todos start` itself
    opened, closed the row here — unconditionally, with no idea who was calling. Two agents
    in one dogfood run found it: one guessed the hint did not apply to it and worked around
    it, the other followed the documented order exactly — report, then `work end` — and
    marked its own homework. The guarantee held everywhere it was written down and nowhere
    it was wired.

    SO THE CHECK GOES WHERE THE WRITE IS. It was in `report` alone, which is the door that
    announces the rule; the row is `assigned` either way, and that field is what says a
    close is not this caller's to make. The work still ends — that is the agent's own
    ledger and nobody else's — and the row stays standing for whoever dispatched it.
    """
    t = titled(root, track, title)
    if not t:
        return "", ""
    held = t.get("assigned") or ""
    if held and state.slug(agent) == held:
        return "", (f"to-do {t['n']} stays open: it is held for `{held}`, and the agent "
                    "that dispatched you closes it. Your work is closed.")
    _update(root, track, t["n"], done=at, how="closed with the work that finished it")
    return str(t["n"]), ""


# ─────────────────────────────── closing from a commit message ────────────────────────────
#: THE PROTOCOL. A commit that finishes a to-do says so in a trailer, in the CLI's own
#: spelling, on its own line in the message:
#:
#:      Journal: todos done 990
#:      Journal: todos done cli-streamline/4 the cap landed with the page
#:
#: A TRAILER, NEVER PROSE. Commit messages here argue, at length, about to-dos — "this
#: closes the placement question" is a sentence, not an instruction, and a matcher loose
#: enough to read it is loose enough to close the wrong thing. The line must start with the
#: trailer and spell the command. `#990` is not used: it belongs to the forge.
#:
#: AT COLUMN 0, AND FOR ONE REASON: a message that DOCUMENTS this protocol shows an example,
#: and an example is indented. Leading whitespace was allowed at first and the commit that
#: added the feature came within one line of closing a to-do numbered in its own changelog.
#: Anywhere in the message is fine — the footer, beside the other trailers, is where it is
#: read — but a line with a space in front of it is a quotation, not an instruction.
#:
#: THE NUMBER IS PER ENVIRONMENT, so `990` alone is ambiguous across a project with several.
#: It resolves against the session's environment first, then against the only environment that
#: has that number — and REFUSES when more than one does, because a close nobody can see is
#: worse than a close that did not happen. `<environment>/<n>` says it outright.
def now() -> str:
    """One timestamp shape, for the callers that write a to-do without going through the CLI."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


TRAILER = "Journal:"
#: COLUMN ZERO, AND THAT IS DELIBERATE — do not "fix" it. Allowing leading whitespace was
#: tried, on the theory that an indented second trailer explained a report of only the first
#: one closing; test_commit holds the opposite and is right: commit messages here discuss
#: to-dos at length, and an INDENTED line is how this project quotes one. A quotation that
#: closes a to-do is worse than a trailer that has to be unindented.
_TRAILER = re.compile(r"^Journal:[ \t]*todos?[ \t]+done[ \t]+"
                      r"(?:(?P<env>[A-Za-z0-9][A-Za-z0-9 _.-]*?)/)?(?P<n>\d+)[ \t]*(?P<how>.*)$",
                      re.IGNORECASE | re.MULTILINE)


def commit_at(project: Path, ref: str = "HEAD") -> tuple[str, str, str] | None:
    """A commit as (sha, subject, whole message), or None where there is no such commit.

    READ THE COMMIT, NOT THE COMMAND that made it. The command is what was asked for; the
    commit is what happened — so a commit a gate rejected closes nothing, and `-m`, `-F -`
    and an editor session all parse the same, because none of them are parsed at all.
    """
    import subprocess
    try:
        p = subprocess.run(["git", "log", "-1", "--format=%H%n%s%n%B", ref], cwd=str(project),
                           capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    if p.returncode != 0 or not p.stdout.strip():
        return None
    sha, _, rest = p.stdout.partition("\n")
    subject, _, body = rest.partition("\n")
    return sha.strip(), subject.strip(), body


def refs_in(message: str) -> list[tuple[str | None, int, str]]:
    """Every close the message asks for: (environment or None, number, the how it gave)."""
    out = []
    for m in _TRAILER.finditer(message or ""):
        out.append((" ".join(m.group("env").split()) if m.group("env") else None,
                    int(m.group("n")), " ".join(m.group("how").split())))
    return out


def environments_with_todos(root: Path) -> list[str]:
    """The environment names that own at least one to-do, read off the to-dos themselves."""
    d = root / DIR
    names = []
    for sub in sorted(d.iterdir()) if d.is_dir() else []:
        if not sub.is_dir():
            continue
        first = next((_parse(f) for f in sorted(sub.glob("*.md"))), None)
        names.append((first or {}).get("track") or sub.name)
    return names


def close_from_commit(root: Path, message: str, how_default: str, at: str,
                      here: str | None = None) -> list[tuple[bool, str]]:
    """Act on every trailer in a commit message.

    Back comes one (did it close, what to say) per ref — the caller writes the headline,
    because "the trailer closed what it named" is a lie when the number was wrong, and a
    hook that overstates what it did is one an agent learns to skim.
    """
    said: list[tuple[bool, str]] = []
    for env, n, how in refs_in(message):
        if env is None:
            seen: set[str] = set()
            owners = []
            for e in ([here] if here else []) + environments_with_todos(root):
                if e not in seen and _get(root, e, n)[0] is not None:
                    seen.add(e)
                    owners.append(e)
            if not owners:
                said.append((False, f"to-do {n}: no environment has one — nothing closed"))
                continue
            if len(owners) > 1 and (here not in owners):
                said.append((False, f"to-do {n} is ambiguous — {', '.join(owners)} all have one. "
                                    f"Spell it: {TRAILER} todos done <environment>/{n}"))
                continue
            env = here if here in owners else owners[0]
        t, err = _get(root, env, n)
        if t is None:
            said.append((False, err))
            continue
        if t.get("done"):
            # AN AMEND OR A REBASE RUNS THE HOOK AGAIN over the same message. That is a
            # no-op with a note, not a failure: nothing about the record is wrong.
            said.append((False, f"to-do {n} on `{env}` was already closed ({t.get('how')}) — left as it is"))
            continue
        ok, msg = done(root, env, n, how or how_default, at)
        said.append((ok, msg.splitlines()[0] + f" (on `{env}`)" if ok else msg))
    return said


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


# ─────────────────────────── the to-do's meta: a state, not a chain ────────────────────────
#: A TO-DO IS IN EXACTLY ONE OF THESE, and `_state` is the one place that decides which. It
#: used to be an if/elif ladder inline in `render`, nine branches deep, checked in this same
#: order — and the order is not free: `asks` is set by `ask` and NOTHING EVER CLEARS IT, so
#: a to-do that was once asked a question and has since been started, assigned, reported,
#: blocked or given an `after` carries `asks` right along. Checked this early, it shadows
#: every one of those: `started`, `assigned`, `reported`, `blocked` and `after` are each
#: UNREACHABLE for the rest of that to-do's life, and it reads "waits on the user" forever
#: even mid-work. That is a real bug, reported rather than fixed here — fixing it changes
#: what a live to-do prints, and this pass promised the rendered text would not move.
_STATES = ("done", "answered", "asks", "reported", "assigned", "blocked", "after", "started",
          "waiting")


#: WHAT A TO-DO IS, AND THE TEST THAT SAYS SO. Each row is a state and the predicate that
#: puts a to-do in it; the first match wins, and every predicate is written so that at most
#: one CAN match. That second half is the whole point — a ladder whose rungs overlap makes
#: its own ORDER load-bearing, and then the order is a decision nobody wrote down and
#: everybody has to preserve.
#:
#: `asks` WAS HISTORY BEING READ AS STATE. `ask()` records the question and `answer()`
#: records the reply, and neither is ever cleared — correctly: the exchange is the record of
#: why this row is what it is. But the ladder tested `t["asks"]` third, so any to-do that had
#: EVER been asked a question shadowed every state below it: started, assigned, reported,
#: blocked, after. A row could be picked up, worked, and reported finished while still
#: printing "waits on the user", for the rest of the project. Found by a dogfood agent that
#: was folding this listing into the shared one and refused to fix it silently.
#:
#: SO THE PREDICATE IS PRECISE INSTEAD OF THE ORDER BEING CLEVER. Waiting on the user means
#: a question with no answer AND nobody has picked it up. Starting a row is an agent saying
#: it will proceed without the answer, which is a legitimate thing to do and used to be
#: invisible.
_STATES = (
    ("done",     lambda t: bool(t.get("done"))),
    ("answered", lambda t: answered_one(t)),
    ("asks",     lambda t: bool(t.get("asks")) and not t.get("answer") and not t.get("started")),
    ("reported", lambda t: bool(t.get("reported"))),
    ("assigned", lambda t: bool(t.get("assigned"))),
    ("blocked",  lambda t: bool(t.get("blocked"))),
    ("after",    lambda t: bool(t.get("after"))),
    ("started",  lambda t: bool(t.get("started"))),
    ("waiting",  lambda t: True),
)


def _state(t: dict) -> str:
    """Which state this to-do is in. One name, from one table — see `_STATES`."""
    return next(name for name, is_it in _STATES if is_it(t))


def states_of(t: dict) -> list[str]:
    """EVERY state whose predicate matches, most significant first.

    A LADDER CANNOT BE CHECKED FROM THE OUTSIDE. It always returns exactly one answer, so a
    rung in the wrong place shows up only as a wrong answer in a case nobody thought of —
    which is precisely how `asks` shadowed five states for as long as it did. This exposes
    what else was true, so a test can assert the PRECEDENCE itself rather than assert its
    way through a handful of hand-picked rows.
    """
    return [name for name, is_it in _STATES[:-1] if is_it(t)]


def _held(root: Path, track: str, t: dict) -> str:
    import agents as ag
    return f"held by `{t['assigned']}` ({ag.age(root, track, t['assigned'])})"


#: THE TABLE FROM STATE TO SENTENCE. One entry per name `_state` can return, and every name
#: it can return has one: adding a state means adding a row here, not another `elif`.
_STATE_TEXT = {
    "done": lambda root, track, t: f"done {_age(t['done'])}: {t.get('how') or 'no reason recorded'}",
    "answered": lambda root, track, t: "answered by the user, not yet picked up",
    "asks": lambda root, track, t: "waits on the user",
    "reported": lambda root, track, t: (
        f"reported finished by `{t.get('by') or '?'}` — yours to close: {t['reported']}"),
    "assigned": _held,
    "blocked": lambda root, track, t: f"set aside: {t['blocked']}",
    "after": lambda root, track, t: (
        f"after {t['after']}" + (f" — {len(waiting_on(root, track, t))} still open"
                                 if waiting_on(root, track, t) else ", all done: ready")),
    "started": lambda root, track, t: f"started {_age(t['started'])}, work is open",
    "waiting": lambda root, track, t: (
        f"waiting {_age(t.get('at', ''))}" if _age(t.get("at", "")) else "waiting"),
}


def render(root: Path, track: str, *, all_of_them: bool = False, width: int | None = None, short_refs: bool = False,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    """The list as a person reads it: the title, where it stands, and any question below.

    CAPPED LIKE `carry` (below), for the same reason: a bare `journal todo` is asked for
    fresh each time rather than handed automatically, so it pages past the cap instead
    of just saying how many more there are. `cap` is None by default — the environment
    pickup page (`tracks.page`) calls this uncapped on purpose: a runner has to see the
    WHOLE ordered list, not the first page of it.

    THE LOOP IS `entries.listing`, shared with `docs.catalogue` and `tools.catalogue` —
    only `facts` below is this noun's own, exactly the strategy `pins._store` already
    supplies for a pin, a rule and a reminder.

    THE QUESTION AND ITS ANSWER ARE NOT A FACT, and stay out of `facts`: a fact is a short
    fragment joined into one line with " · ", and a wrapped line breaks wherever it must —
    measured, folding a long answer in with the rest put the wrap point inside the arrow
    itself, on this exact to-do, and the test that reads "→ " off the front of it failed.
    They get their own wrapped block beneath, exactly as they always did.
    """
    width = fmt.room(width)
    import entries
    items = _all(root, track) if all_of_them else open_items(root, track)
    if not items:
        return "  Nothing is waiting." if not all_of_them else "  No to-dos on this environment."

    def facts(t: dict) -> list[str]:
        out = [_STATE_TEXT[_state(t)](root, track, t)]
        out.append("has a brief" if t["body"] else "title only")
        if t.get("doc"):
            import docs as docs_mod
            out.append("→ " + docs_mod.ref_label(root, str(t["doc"]), short=short_refs))
        return out

    def item_of(t: dict):
        return fmt.Item(n=t["n"], text=t["title"], meta=" · ".join(facts(t)),
                        struck=bool(t.get("done")))

    rows, left = entries.listing(items, item_of, cap=cap, page=page, order=order)
    paged, _ = fmt.paged(items, cap, page, order)
    blocks = []
    for t, it in zip(paged, rows):
        entry = fmt.render(fmt.Out(items=(it,)))
        # SAME CONDITION THE LADDER GATED ITS OWN EXTRA LINES ON: still waiting, not yet
        # started, not done.
        if t.get("asks") and not t.get("done") and not t.get("started"):
            entry += "\n" + fmt.wrap("? " + t["asks"], indent=5, width=width)
            if t.get("answer"):
                entry += "\n" + fmt.wrap("→ " + t["answer"], indent=5, width=width)
        blocks.append(entry)
    return "\n\n".join(blocks) + fmt.more("todos", left, page, order)


def show(root: Path, track: str, n: int, width: int | None = None) -> tuple[bool, str]:
    width = fmt.room(width)
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    meta = [f"environment {track}"]
    if t.get("at"):
        meta.append(f"written {_age(t['at'])} ({t['at'][:10]})")
    if t.get("line"):
        meta.append(f"line {t['line']}")
    if t.get("started"):
        meta.append(f"started {_age(t['started'])}")
    if t.get("done"):
        meta.append(f"done {_age(t['done'])}: {t.get('how')}")
    if t.get("doc"):
        import docs as docs_mod
        meta.append("→ " + docs_mod.ref_label(root, str(t["doc"])))
    out = [fmt.title(f"TO-DO {n}", sub=" ".join(t["title"].split())), "  " + fmt.dim(" · ".join(meta))]
    if t.get("asks"):
        out.append(fmt.section("the user answered" if t.get("answer") else "waiting on the user"))
        out.append(fmt.wrap(t["asks"], width=width))
        if t.get("answer"):
            out.append("")
            out.append(fmt.wrap("→ " + t["answer"], width=width))
    out.append(fmt.section("brief"))
    # fmt.PROSE, NOT fmt.wrap AND NOT fmt.block. `wrap` joins every line of the brief into
    # one, which swallows an indented list and a `## ` heading alike into run-on prose.
    # `block` was the other extreme: it kept every stored line exactly as written, so a
    # paragraph hard-wrapped by its author at whatever width their editor had wrapped a
    # SECOND time in a narrower terminal and left a stub under each line. `prose` is the
    # distinction — a paragraph flows, a list and a code block and a table do not.
    out.append(fmt.prose(t["body"], width=width) if t["body"] else "  (title only; no brief was written)")
    out.append("")
    rows = []
    if not t.get("done"):
        rows.append((f"journal todos start {n}", "pick it up"))
        rows.append((f'journal todos done {n} "<how>"', "close it without starting"))
        if t.get("asks") and not t.get("answer"):
            rows.append((f'journal todos answer {n} "<answer>"', "answer it (the user)"))
        elif not t.get("asks"):
            rows.append((f'journal todos ask {n} "<question>"', "it waits on the user"))
            rows.append((f'journal todos block {n} "<what has to be true first>"',
                         "you cannot do it yet, and it is not a question for them"))
            rows.append((f"journal todos after {n} 12,14",
                         "it must follow those; it goes ready when the last one closes"))
    if rows:
        out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(str(t["path"].relative_to(root.parent))))
    return True, "\n".join(out)


AUTO = "auto"


def auto(root: Path, track: str) -> bool:
    """May the agent work through this environment's list without asking?

    OFF BY DEFAULT, AND THE DEFAULT IS THE POINT. A to-do is work the user put off, and
    whether it gets picked up is their call — unless they have said, for this environment, that
    the agent should work through the list on its own. The flag is that saying, on the
    record, per environment: an environment of chores can drain while an environment of design questions waits.
    """
    got = state.get(root, AUTO, {})
    return bool(isinstance(got, dict) and got.get(track))


def set_auto(root: Path, track: str, on: bool) -> str:
    with state.locked(root):
        got = state.get(root, AUTO, {})
        got = got if isinstance(got, dict) else {}
        got[track] = bool(on)
        state.put(root, AUTO, got)
    return (f"auto ON for `{track}`: whenever no work is open, the agent picks up the next "
            "to-do on its own and keeps going until the list is empty.\n"
            "  START A LOOP NOW, or nothing will wake this session at its next idle stop and "
            "the list will sit where it is:\n"
            "    the `loop` skill with `15m journal next`\n"
            "  Until one is running (or `journal loop set` says one is), the next write is "
            "refused — auto without a loop is a promise nothing keeps."
            if on else
            f"auto OFF for `{track}`: to-dos are listed and never started without the user's word.")


def _loop_line(root: Path) -> str:
    from settings import load
    m = load(root)[0].get("auto_loop_minutes", 0)
    if not m:
        return ""
    return (f"Keep a loop running while auto is on, if none is: the `loop` skill with "
            f"`{m}m journal next`, so an idle session comes back every {m} minutes and carries "
            "on until nothing is left it can do.")


def carry(root: Path, track: str, cap: int = 0) -> str:
    """The block a session start hands over. Titles only; what it asks depends on auto.

    CAPPED AFTER THE SORT, NEVER BEFORE. The answered ones come first because they are the
    user's word to proceed, and the ones waiting on the user carry their question — so
    those are exactly the entries a trim must never take. Sorting first and cutting the
    tail means what is dropped is the ordinary end of the list, and `fmt.cut` says how many
    and which command reads them.
    """
    waiting = open_items(root, track)
    if not waiting:
        return ""
    def line(t):
        s = f"  {t['n']:>3}  {t['title']}"
        if answered_one(t):
            s += f"\n       ANSWERED by the user: {t['answer']}\n       (the question was: {t['asks']})"
        elif t.get("asks") and not t.get("started"):
            s += f"\n       waiting on the user: {t['asks']}"
        return s
    ordered = sorted(waiting, key=lambda t: 0 if answered_one(t) else 1)
    shown = ordered[:cap] if cap else ordered
    titles = "\n".join(line(t) for t in shown) + fmt.cut(len(shown), len(ordered), "journal todos")
    blocked = asking(root, track)
    unstuck = answered(root, track)
    lead = (f"{len(unstuck)} of these the user has ANSWERED since they were parked — pick those up "
            "first.\n" if unstuck else "")
    if auto(root, track):
        return (
            f"TO DO on this environment, {len(waiting)} waiting — AUTO MODE IS ON: this list is worked "
            "through without asking. Whenever nothing is open, pick up the next one with "
            "`journal todos start <n>`, solve it yourself, `journal work end` it, and keep going "
            "until the list is empty. Every choice a brief leaves open is yours: make it, write it "
            "in `journal work update`, carry on. Ask the user only when you cannot proceed without "
            "something only they can supply, or the hook says you are stalled — then `journal todos add "
            'ask <n> "<what is stuck>"` and move to the next. ' + _loop_line(root)
            + "\n" + lead + titles
            + (f"\n{len(blocked)} of these wait on the user; the questions are above. When the "
               "user answers, `journal todos start <n>`." if blocked else "")
            + "\n`journal todos <n>` reads the brief; `journal todos auto off` turns this off."
        )
    return (
        f"TO DO on this environment, {len(waiting)} waiting — delayed work, not an instruction to "
        "start any of it. Start one only when the user says so, or asks you to work through "
        "them (then offer `journal todos auto on`). A to-do the user has ANSWERED is theirs "
        "saying to do it: start it.\n" + lead + titles
        + "\n`journal todos <n>` reads the brief; `journal todos start <n>` picks one up."
    )
