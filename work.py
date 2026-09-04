"""Declaring a piece of work — the one thing here that is WRITTEN, and the one that costs.

A TAG IS FREE AND A DECLARATION IS NOT, and the difference is the point. A tag rides on a
message you were sending anyway, so it is spent generously and describes what that message
carried. Starting work is a COMMITMENT: it says a thing is now in flight and somebody is
answerable for finishing it. Making that cost a deliberate command is what makes it done
with thought — a free one would be sprayed across every message that mentions doing
something, and then `open` would list forty things nobody is holding.

It is also the one fact a transcript cannot yield. Everything else here is derived on
demand from what was said; whether a piece of work is STILL OPEN is not in anything that
was said — it is the absence of a later sentence, and an absence is not readable. So it is
state, it is small, and it is written down.
"""
from __future__ import annotations

import os
from pathlib import Path

import state

KEY = "work"


def _all(root: Path) -> list[dict]:
    got = state.get(root, KEY, [])
    return got if isinstance(got, list) else []


AWAIT = "awaiting"


def open_work(root: Path) -> list[dict]:
    return [w for w in _all(root) if not w.get("ended")]


def start(root: Path, subject: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Declare work. Refuses a duplicate rather than opening a second of the same thing.

    `where` records which transcript opened it. The journal is shared, so work opened in
    one session is still open in the next — and the next session is TOLD about it at its
    start, not HELD for it at its first stop. A hold is for a commitment this agent made;
    the stop hook uses the recorded transcript to tell the two apart.
    """
    subject = " ".join(subject.split())
    if not subject:
        return False, "start what? give it a name you will say again to close it"
    with state.locked(root):
        for w in open_work(root):
            if w["subject"].lower() == subject.lower():
                return False, f"already open since {w['at'][:19]} — nothing to do"
        items = _all(root)
        items.append({"subject": subject, "at": at, "ended": None, **(where or {})})
        state.put(root, KEY, items)
    return True, f"open: {subject}"


def end(root: Path, subject: str, at: str) -> tuple[bool, str]:
    """Close it by saying the same words.

    A close that matched nothing is REFUSED and lists what is open. Silently accepting it
    would let the agent believe it had closed work that is still standing — and an open
    piece of work nobody knows about is exactly what this exists to prevent.
    """
    subject = " ".join(subject.split()).lower()
    with state.locked(root):
        items = _all(root)
        for w in items:
            if not w.get("ended") and w["subject"].lower() == subject:
                w["ended"] = at
                state.put(root, KEY, items)
                return True, f"closed: {w['subject']}"
    still = open_work(root)
    if not still:
        return False, "nothing is open"
    return False, "that closes nothing. Open:\n" + "\n".join(
        f"  {w['subject']}" for w in still
    )


def awaiting(w: dict, now: float) -> dict | None:
    """The wait still standing on this work, or None — expired counts as not waiting."""
    got = w.get(AWAIT)
    if not isinstance(got, dict):
        return None
    return got if now < float(got.get("until") or 0) else None


def expired(w: dict, now: float) -> dict | None:
    """The wait that has RUN OUT on this work, or None. What brings the hold back."""
    got = w.get(AWAIT)
    if not isinstance(got, dict):
        return None
    return got if now >= float(got.get("until") or 0) else None


def alive(pid: int) -> bool:
    """Is that process still running? Signal 0 asks without sending anything."""
    try:
        os.kill(int(pid), 0)
    except ProcessLookupError:
        return False
    except (PermissionError, OverflowError, ValueError, TypeError):
        return True   # it exists and is not ours, or the number is not askable: do not claim it died
    return True


def wait(root: Path, what: str, minutes: float, at: str, now: float,
         on: str | None = None, agent: str | None = None,
         pid: int | None = None) -> tuple[bool, str]:
    """Mark open work as waiting on something, so the stop hold leaves it alone until then.

    A HOLD THAT FIRES WHILE NOTHING CAN MOVE IS NOISE, and noise is what teaches a reader
    to clear a hold without reading it. Work that is genuinely in flight — a subagent
    running, a build, a review — is open for a good reason and has nothing to file at every
    stop; measured on this project's own session, three consecutive stops were held for
    work that was correctly open and simply waiting, each costing an update that said the
    same thing.

    IT ALWAYS EXPIRES. A wait with no end is how work is abandoned quietly: the thing being
    waited for dies, nothing nudges, and the journal reads as busy forever. So the wait has
    a deadline, and when it passes the hold comes back naming what was awaited and for how
    long — the one question worth asking then is whether it is still coming.
    """
    what = " ".join((what or "").split())
    if not what:
        return False, 'await what? `journal work await "<what you are waiting for>"`'
    if minutes <= 0:
        return False, "a wait needs a timeout in minutes: nothing may wait forever"
    with state.locked(root):
        items = _all(root)
        standing = [w for w in items if not w.get("ended")]
        if not standing:
            return False, "nothing is open to wait on — `journal work start` first"
        if on:
            key = " ".join(on.split()).lower()
            picked = [w for w in standing if w["subject"].lower() == key]
            if not picked:
                return False, "that names no open work. Open:\n" + "\n".join(
                    f"  {w['subject']}" for w in standing)
        elif len(standing) > 1:
            return False, ("several pieces of work are open, so this would have to guess which one "
                           "waits. Name it:\n" + "\n".join(
                               f'  journal work await "..." --on="{w["subject"]}"' for w in standing))
        else:
            picked = standing
        picked[0][AWAIT] = {"what": what, "until": now + minutes * 60, "at": at,
                            "minutes": minutes, "agent": agent or None, "pid": pid or None}
        state.put(root, KEY, items)
    mins = int(minutes) if float(minutes).is_integer() else minutes
    who = f" ({named(picked[0][AWAIT])})" if named(picked[0][AWAIT]) else ""
    return True, (f"waiting on {what}{who} — `{picked[0]['subject']}` is not held for {mins} minute(s).\n"
                  "  the FIRST WRITE ends it by itself — reading keeps waiting, editing is the "
                  "work resuming — and so does any `work update` or `work end`; after that the "
                  "hold returns and asks whether it is still coming"
                  + ("\n  the pid is watched: if it exits, the wait is over at the next stop"
                     if pid else ""))


def named(got: dict) -> str:
    """The identifier of the thing being awaited, if one was given."""
    if not isinstance(got, dict):
        return ""
    if got.get("agent"):
        return f"agent {got['agent']}"
    if got.get("pid"):
        return f"pid {got['pid']}"
    return ""


def gone(w: dict) -> dict | None:
    """A wait whose named PROCESS has exited — over early, whatever the clock says.

    AN IDENTIFIER IS WHAT MAKES A WAIT CHECKABLE. "waiting on the build" is a sentence; a
    pid is a fact the machine can test, so a wait on one ends when the thing ends instead
    of burning its whole timeout. An agent id cannot be tested from here — nothing exposes
    a subagent's liveness to a hook — so it is recorded and shown, and its wait runs on the
    clock like any other.
    """
    got = w.get(AWAIT)
    if not isinstance(got, dict) or not got.get("pid"):
        return None
    return None if alive(got["pid"]) else got


def woke(root: Path, subject: str) -> None:
    """Progress arrived: the wait is over, whatever the clock says."""
    with state.locked(root):
        items = _all(root)
        for w in items:
            if not w.get("ended") and w["subject"].lower() == subject.lower() and w.get(AWAIT):
                w.pop(AWAIT, None)
                state.put(root, KEY, items)
                return


def resumed(root: Path, owners: set) -> str | None:
    """The work moved again, so it is not waiting any more. Returns the subject it woke.

    THE USER'S RULING: a wait ends when the work starts again, and it should not need a
    command to say so. `await` says "this is in flight on something I cannot hurry", and it
    buys silence — the stop stops nudging. That silence is correct while the agent is
    genuinely blocked and wrong the moment it is not, and the agent that has picked the work
    back up is the least likely thing in the system to remember to say so. Measured: a
    runner awaited a subagent, resumed on its own, worked for eighteen minutes and stopped
    into silence with the record still reading "in flight".

    A WRITE IS THE SIGNAL, not any tool call. Reading is what waiting LOOKS like — polling a
    log, checking whether the build is done, tailing an output file — so a read must leave
    the wait standing or `await` would cancel itself on the first thing an agent does after
    filing it. A write is different: nothing that is still blocked edits a file. It is the
    same line this package already draws at its gate, where reads are never refused and
    changes are.
    """
    with state.locked(root):
        items = _all(root)
        for w in items:
            if w.get("ended") or not w.get(AWAIT) or w.get("session") not in owners:
                continue
            w.pop(AWAIT, None)
            state.put(root, KEY, items)
            return w["subject"]
    return None


def note(root: Path, text: str, at: str, on: str | None = None) -> tuple[bool, str]:
    """File progress AGAINST a piece of work. The thing `[!update]` was pretending to be.

    It is a command and not a tag for the reason `start` is: it is about the WORK, not
    about the message carrying it. A tag describes what you just said and can therefore
    never be wrong; an update makes a claim about something outside itself, and the moment
    that claim can be wrong it stops being free. This one costs a command, and that cost is
    the thought.

    It REFUSES with nothing open, and refuses to guess between several. Attaching a note to
    the wrong scope is worse than not filing it: the note reads as true under a heading it
    was never about, and nothing about it looks broken afterwards.
    """
    text = " ".join((text or "").split())
    if not text:
        return False, "update what? say what moved, in one line"
    with state.locked(root):
        return _note(root, text, at, on)


def _note(root: Path, text: str, at: str, on: str | None) -> tuple[bool, str]:
    standing = open_work(root)
    if not standing:
        return False, (
            "nothing is open, so there is no work for this to be about.\n"
            "  journal start \"<the work>\"   then update it"
        )
    if on:
        want = " ".join(on.split()).lower()
        match = [w for w in standing if w["subject"].lower() == want]
        if not match:
            return False, "--on matches nothing open. Open:\n" + "\n".join(
                f"  {w['subject']}" for w in standing
            )
        target = match[0]
    elif len(standing) > 1:
        return False, (
            "several pieces of work are open, so this would have to guess which one "
            "moved. Name it:\n"
            + "\n".join(f"  journal update \"...\" --on=\"{w['subject']}\"" for w in standing)
        )
    else:
        target = standing[0]

    items = _all(root)
    for w in items:
        if w is target or (not w.get("ended") and w["subject"] == target["subject"]):
            w.setdefault("notes", []).append({"at": at, "text": text})
            w.pop(AWAIT, None)   # progress arrived: whatever was awaited is no longer awaited
            state.put(root, KEY, items)
            n = len(w["notes"])
            return True, f"{target['subject']}: {n} update(s) filed"
    return False, "that work vanished between reading it and writing to it"
