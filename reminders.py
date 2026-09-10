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

import entries
import fmt
import state
from pins import age

KEY = "reminders"

#: WHAT A REMINDER IS TO THE SHARED OPERATIONS. Retiring one and moving one are the same
#: acts they are for a pin, so they are the same code — see `entries`.
def _facts(r: dict, n: int) -> list[str]:
    """What is said beneath a reminder. The condition is META, never text: `numbered`
    rewraps the text, so a newline inside it is lost and the condition would run on into
    the instruction as one sentence — the misreading that retires the wrong reminder."""
    out = []
    if r.get("done"):
        out.append(f"retired: {r['done']}")
    if age(r.get("at", "")):
        out.append(age(r.get("at", "")))
    if r.get("moved_from"):
        out.append(f"moved from {r['moved_from']}")
    if r.get("until"):
        out.append(f"until: {r['until']}")
    return out


_STORE = entries.Store(key=KEY, noun="reminder", text="text", retired="done",
                       verb="retired", facts=_facts)


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
    """Retire a reminder. The reason is required, exactly as a strike's is — and for the
    same reason, which is why both go through `entries.retire`.

    Nothing here expires on a counter. A reminder the agent quietly stopped showing is
    indistinguishable from one the user never wrote, so the only way out of the list is
    somebody saying what changed — and the text stays, under `--all`, so being wrong about
    a condition costs one line to undo.
    """
    return entries.retire(root, _STORE, n, why, at)


def move(root: Path, n: int, dst: str, at: str) -> tuple[bool, str]:
    """Move a reminder to another environment — it belongs to one, like a pin."""
    return entries.move(root, _STORE, n, dst, at)


def block(root: Path) -> str:
    """What the hook says: every standing reminder, or "" when there are none.

    THE SCAFFOLDING IS THE PART THAT GOES STALE, NOT THE INSTRUCTION. This block is
    delivered at the head of every stop chain and again every `reminder_every` tool calls,
    and the first version wrapped each firing in a header, a gloss on what `until` means
    and the command that retires one — three lines of furniture around one line of
    instruction, repeated all session. That is how a reader is taught to skim, and the
    thing they learn to skim is the reminder itself.

    ONE FORM, NOT TWO. The fix after that shipped kept the gloss for the stop and dropped it
    only mid-turn, which was the same argument applied to half the firings: the stop copy
    fires just as often over a long session, and it is the copy the USER sees, where the
    gloss is furniture in their terminal too. `journal reminders done` is taught in the
    skill, in `journal reminders`, and in the line printed when the reminder is written —
    three places read on purpose rather than injected on a cadence.

    AND THE HEADING IS ONE WORD. It read `REMINDERS — 3 things you asked to be told again:`,
    which is the package narrating its own delivery: who asked, how many, and that this is a
    repeat. None of that is the instruction, all of it is charged to the reader every stop
    for the whole session, and the user's answer to it was blunt and is the right one — the
    reminders are what was asked for, so the reminders are what is said. What survives is a
    label, because a block of numbered lines dropped into a stop with no label at all is a
    list of unattributed orders.

    NEVER CAPPED AND NEVER PAGED. `render` below pages because a person asked for the list
    and can ask for the next page; this is the injection, and a reminder trimmed out of it
    is a reminder that silently stopped being one.
    """
    items = live(root)
    if not items:
        return ""
    # A NUMBER IS FOR PICKING ONE OUT OF SEVERAL. With one standing it is furniture, and
    # the number that matters — the one `reminders done` takes — is the position in the
    # full list, which is what is printed here either way.
    out = ["REMINDER:" if len(items) == 1 else "REMINDERS:"]
    # THROUGH THE SAME RENDERER THE LIST USES, AND WITH AIR BETWEEN THE ITEMS. This built
    # its own lines and never wrapped one, so seven reminders arrived as seven unbroken
    # 180-character strings stacked with no gap — the user's word for it, twice now: a wall
    # of text. An instruction nobody can find the start of is not being delivered, however
    # reliably it is printed. `fmt.numbered` already wraps a numbered entry under its own
    # number and puts the meta beneath it; this is the same shape, so it is the same code.
    for i, r in enumerate(_all(root), 1):
        if r.get("done"):
            continue
        out.append(fmt.numbered(i, r["text"], f"until: {r['until']}" if r.get("until") else ""))
    return "\n\n".join(out)


def listing(root: Path, *, all_of_them: bool = False, cap: int | None = None,
            page: int = 1, order: str = fmt.DESC):
    """(the rows, how many were left off). The same LOOP as `pins.listing`, which is a
    fact about the code: a reminder belongs to one environment, exactly like a pin."""
    return entries.rows(root, _STORE, all_of_them=all_of_them, cap=cap, page=page, order=order)


def render(root: Path, *, all_of_them: bool = False, width: int | None = None,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    """The list as text, for the callers that want a finished string rather than rows.

    THE LOOP IS `entries.rows`, NOT A SECOND COPY OF IT. That is a statement about CODE and
    about nothing else: a reminder is bound to its environment exactly as a pin is, and
    neither is visible from another one. What pins, rules and reminders have in common is
    that each is a numbered store whose listing enumerates, pages, keeps a retired entry's
    number and prints facts beneath the text — one loop, three nouns, and the only thing any
    of them supplies is which facts.
    """
    width = fmt.room(width)
    if not _all(root):
        return "  Nothing is being repeated."
    items, left = listing(root, all_of_them=all_of_them, cap=cap, page=page, order=order)
    if not items:
        return "  Nothing is being repeated. `journal reminders --all` shows the retired ones."
    return fmt.render(fmt.Out(items=tuple(items))) + fmt.more(KEY, left, page, order)
