"""A standing instruction, said again at every stop and every N tool calls.

WHAT DRIFTS IS NOT WHAT IS FORGOTTEN. A pin and a rule are handed over once, at a session
start and on the far side of every compaction, and then they sit in a window that grows by
tens of thousands of characters an hour. Nothing evicts them and nothing needs to: they
are simply further away at every turn, and an instruction fifty tool calls back is read
with less weight than the tool result that just landed. The user's own words for it: after
a long session the agent might drift and not remember what we asked it.

SO A REMINDER IS THE ONE THING HERE THAT REPEATS. Every other channel in this package
fires on a condition and yields once it has fired — the stop queue raises one subject per
stop precisely so a wall of reminders is not read past as one, `on_post_tool` speaks only
on a new record, a rung climbs once. A reminder has no condition. It is shown at every
stop, ahead of the queue and without spending the queue's one slot, and again mid-turn
every `reminder_every` tool calls, because the stop where the queue lives can be an hour
of tool calls away.

ONCE PER STOP CHAIN, THOUGH, AND THAT IS NOT A HEDGE. A Stop that returns anything is
re-entered with `stop_hook_active`; the first shape of this answered its own re-entry and
woke a live session three times over with nobody asking for anything. The flag is what
tells a fresh stop from the tail of one already being worked, and the queue's subjects
already draw that line. A reminder draws it too and loses nothing: every stop a person
actually sees is the head of a chain.

AND THE USER SEES IT. Everything else the hook says to the agent is the agent's business
rendered in somebody else's terminal, which is why `_hold` was cut to one line. A reminder
is the exception the user asked for: they wrote it, and seeing it come back is the
confirmation that it landed. Same text, both fields.

THE STOP CONDITION IS PROSE, AND THAT IS DELIBERATE. `--until="the migration tests pass"`
is read by the AGENT at every firing, not by a checker: nothing in here can evaluate it,
and a condition language that could would only ever cover the conditions somebody thought
to implement. So the agent judges it and retires the reminder itself, the way it strikes a
stale rule — cheap to be wrong, because a retired reminder keeps its text under
`reminders --all` and can be added again in one line.

A REMINDER IS NOT A PIN. The test is the same three questions turned around: is this
something the reader must be told AGAIN, not merely told? A fact the next reader would get
wrong without is a pin. A thing you keep having to say is a reminder. If it is neither, it
is a message, and a message is free.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import fmt
import state
from pins import age

KEY = "reminders"


def _all(root: Path) -> list[dict]:
    got = state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def live(root: Path) -> list[dict]:
    return [r for r in _all(root) if not r.get("done")]


def add(root: Path, text: str, at: str, limit: int, until: str = "") -> tuple[bool, str]:
    """Start reminding. Refuses a paragraph, for the same reason a pin does — and harder.

    A pin is re-read at every compaction; a reminder is re-read at every stop and every
    fifteenth tool call, which in one long session is dozens of times. What does not fit
    in a line is not an instruction, it is a briefing, and a briefing repeated fifty times
    is the wall this package's stop queue exists to avoid.
    """
    text = " ".join(text.split())
    until = " ".join((until or "").split())
    if not text:
        return False, 'remind you of what? one line: journal reminders add "<the instruction>"'
    if limit and len(text) > limit:
        return False, (
            f"{len(text)} characters, and a reminder has {limit}. This is said again at "
            f"every stop and every few tool calls, so it has to be the INSTRUCTION and "
            f"nothing else:\n"
            f"  keep  {text[:limit - 20]}…\n"
            f"  cut   {text[limit - 20:][:120]}\n"
            "The reasoning behind it is a pin, or a doc. What repeats is the one line."
        )
    made = {"text": text, "at": at, "until": until, "done": None}
    # THE RECORD IS SHARED: load and save under one lock, or two sessions adding at once
    # each write the other's away — the silent loss `pins.add` learned the hard way.
    with state.locked(root):
        items = _all(root)
        items.append(made)
        state.put(root, KEY, items)
        standing = len([r for r in items if not r.get("done")])
    out = f"reminder {len(items)} ({standing} standing) — said at every stop from now on"
    if until:
        out += f"\n  until: {until}\n  you judge that yourself, and retire it when it reads true:"
        out += f'\n  journal reminders done {len(items)} "<what made it true>"'
    else:
        out += f'\n  it stands until you retire it: journal reminders done {len(items)} "<why>"'
    return True, out


def done(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    """Retire a reminder. The reason is required, exactly as a strike's is.

    Nothing here expires on a counter. A reminder the agent quietly stopped showing is
    indistinguishable from one the user never wrote, so the only way out of the list is
    somebody saying what changed — and the text stays, under `--all`, so being wrong about
    a condition costs one line to undo.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, (
            f'retiring a reminder needs a reason: journal reminders done {n} "<what made '
            f'it true>". The reason is the whole safeguard — a reminder that vanishes '
            f"without one is one the user is still owed."
        )
    with state.locked(root):
        items = _all(root)
        if n < 1 or n > len(items):
            return False, f"there is no reminder {n}. `journal reminders` numbers them."
        if items[n - 1].get("done"):
            return False, f"reminder {n} was already retired: {items[n - 1]['done']}"
        items[n - 1]["done"] = why
        items[n - 1]["done_at"] = at
        state.put(root, KEY, items)
        standing = len([r for r in items if not r.get("done")])
    return True, f"reminder {n} retired: {why} ({standing} still standing)"


def move(root: Path, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Move a reminder to another environment — retired here, standing there.

    `pins.move`'s decision, for `pins.move`'s reason: the number is the position in the
    full list, so lifting one out would renumber every reminder after it. The retirement
    reason says where it went, and `--all` still shows it on both sides.
    """
    dst = state.slug(dst)
    if not dst:
        return False, 'say where: journal reminders move <n> "<environment>"'
    with state.locked(root):
        items = _all(root)
        i = n - 1
        if i < 0 or i >= len(items):
            return False, f"there is no reminder {n}. `journal reminders` numbers them."
        if items[i].get("done"):
            return False, f"reminder {n} is already retired: {items[i]['done']}"
        there = state.tracked(root, KEY, dst, []) or []
        there.append({**items[i], "at": at, "done": None, "moved_from": n})
        items[i]["done"] = f"moved to `{dst}` as reminder {len(there)}"
        items[i]["done_at"] = at
        state.put_tracked(root, KEY, dst, there)
        state.put(root, KEY, items)
    return True, f"reminder {n} is reminder {len(there)} on `{dst}`: {items[i]['text'][:70]}"


def block(root: Path) -> str:
    """What the hook says: every standing reminder, in full, or "" when there are none.

    NEVER CAPPED AND NEVER PAGED. `render` below pages because a person asked for the list
    and can ask for the next page; this is the injection, and a reminder trimmed out of it
    is a reminder that silently stopped being one. If the list is long enough for that to
    hurt, the answer is retiring some, which is one command and is said here every time.
    """
    items = live(root)
    if not items:
        return ""
    head = "REMINDER — you asked to be told this again:" if len(items) == 1 else \
           f"REMINDERS — {len(items)} things you asked to be told again:"
    out = [head]
    for i, r in enumerate(_all(root), 1):
        if r.get("done"):
            continue
        line = f"  {i}. {r['text']}"
        if r.get("until"):
            line += f"\n     until: {r['until']} — retire it yourself the moment that reads true"
        out.append(line)
    out.append('  journal reminders done <n> "<why>"   when one has served its purpose')
    return "\n".join(out)


def system_line(root: Path) -> str:
    """The half the USER sees — the confirmation that the agent was in fact reminded."""
    items = live(root)
    if not items:
        return ""
    if len(items) == 1:
        return f"journal: reminded — {items[0]['text']}"
    return f"journal: reminded of {len(items)} things — " + " · ".join(r["text"] for r in items)


def render(root: Path, *, all_of_them: bool = False, width: int = 88,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    """The list as a person reads it. The number is the position in the FULL list.

    A retired reminder keeps its number and is simply not shown, for the reason a struck
    pin does: renumbering would make "reminder 3" mean a different instruction after every
    retirement, and the number is what `done` and `move` take.
    """
    items = _all(root)
    if not items:
        return "  Nothing is being repeated."
    shown = [(i, r) for i, r in enumerate(items, 1) if all_of_them or not r.get("done")]
    if not shown:
        return "  Nothing is being repeated. `journal reminders --all` shows the retired ones."
    shown, left = fmt.paged(shown, cap, page, order)
    out = []
    for i, r in shown:
        gone = r.get("done")
        meta = []
        if gone:
            meta.append(f"retired: {gone}")
        when = age(r.get("at", ""))
        if when:
            meta.append(when)
        if r.get("moved_from"):
            meta.append(f"moved from {r['moved_from']}")
        # THE CONDITION IS META, NOT TEXT. `fmt.numbered` rewraps the claim, so a newline
        # inside it is lost and the condition runs on into the instruction as one sentence
        # — which is exactly the misreading that would retire the wrong reminder.
        if r.get("until"):
            meta.append(f"until: {r['until']}")
        out.append(fmt.numbered(i, r["text"], " · ".join(meta), struck=bool(gone), width=width))
    return "\n\n".join(out) + fmt.more(KEY, left, page, order)
