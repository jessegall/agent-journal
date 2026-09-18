from __future__ import annotations

import os
import re
from pathlib import Path

import state
from templates import render

KEY = "work"

MESSAGES = {
    "named_agent": "agent {agent}",
    "named_pid": "pid {pid}",
    "start_what": "start what? give it a name you will say again to close it",
    "already_open": "already open since {since} — nothing to do",
    "opened": "open: {subject}",
    "nothing_open": "nothing is open",
    "forced": "closed {n} with --force:\n  {subjects:\n  }",
    "closed": "closed: {subject}",
    "closes_nothing": "that closes nothing. Open:\n  {subjects:\n  }",
    "await_what": 'await what? `journal work await "<what you are waiting for>"`',
    "park_why": 'park what? `journal work park "<why it is set aside>"`',
    "nothing_to_park": "nothing is open to park — `journal work start` first",
    "park_guess": "several pieces of work are open, so this would have to guess which one is parked. Name it:\n"
                  "{names:\n}",
    "park_name": '  journal work park "..." --on="{subject}"',
    "parked": "parked: `{subject}` — {why}.\n"
              "  it stays open and off the stop's nudging. The first `work update` on it picks it up again;\n"
              "  `work end` still closes it.",
    "no_timeout": "a wait needs a timeout in minutes: nothing may wait forever",
    "nothing_to_wait": "nothing is open to wait on — `journal work start` first",
    "names_no_work": "that names no open work. Open:\n  {subjects:\n  }",
    "await_guess": "several pieces of work are open, so this would have to guess which one waits. Name it:\n"
                   "{names:\n}",
    "await_name": '  journal work await "..." --on="{subject}"',
    "waiting": "waiting on {what}[ ({who})] — `{subject}` is not held for {mins} minute(s).\n",
    "ends_named": "  it names what it waits on, so it ends when THAT does: the clock, the pid exiting, or your "
                  "own `work update`/`work end`. A write about something else leaves it standing, which is the "
                  "whole point of waiting",
    "ends_on_write": "  the FIRST WRITE ends it by itself — reading keeps waiting, editing is the work resuming — "
                     "and so does any `work update` or `work end`; after that the hold returns and asks whether "
                     "it is still coming",
    "pid_watched": "\n  the pid is watched: if it exits, the wait is over at the next stop",
    "update_what": "update what? say what moved, in one line",
    "no_work_for_update": 'nothing is open, so there is no work for this to be about.\n'
                          '  journal start "<the work>"   then update it',
    "on_matches_nothing": "--on matches nothing open. Open:\n  {subjects:\n  }",
    "update_guess": "several pieces of work are open, so this would have to guess which one moved. Name it:\n"
                    "{names:\n}",
    "update_name": '  journal update "..." --on="{subject}"',
    "filed": "{subject}: {n} update(s) filed",
    "vanished": "that work vanished between reading it and writing to it",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _subjects(items: list[dict]) -> list[str]:
    return [w["subject"] for w in items]


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


AWAIT = "awaiting"
PARK = "parked"


def open_work(root: Path, track: str | None = None) -> list[dict]:
    return [w for w in _all(root, track) if not w.get("ended")]


#: the tools an agent reaches for, which are what it reaches for INSTEAD of naming the change
_TOOL_WORDS = frozenset(("bash", "read", "edit", "write", "grep", "glob", "task", "agent", "todowrite",
                         "notebookedit", "webfetch", "websearch", "python", "python3", "node", "npm",
                         "git", "ls", "cat", "sed", "awk", "stuff", "things"))
#: what the second word of a two-word subject must not be: it names nothing on its own
_VAGUE = frozenset(("it", "this", "that", "them", "these", "those", "stuff", "things", "everything",
                    "something", "some", "more"))


def too_bare(subject: str) -> bool:
    words = [w for w in re.split(r"[\s/]+", (subject or "").strip().lower()) if w]
    if not words:
        return False
    if len(words) == 1:
        return True
    if len(words) > 2:
        return False
    # two words, and one of them says nothing: "Edit app.py" names the tool, "fix it" names nothing at
    # all — "it" is clear to whoever is holding the thought, which is nobody by the next session
    return words[0].strip(":") in _TOOL_WORDS or words[1].strip(".,:") in _VAGUE


def start(root: Path, subject: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    subject = " ".join(subject.split())
    if not subject:
        return False, say("start_what")
    import titles
    named, why = titles.check(subject, "work")
    if not named:
        return False, why
    with state.locked(root):
        for w in open_work(root):
            if w["subject"].lower() == subject.lower():
                return False, say("already_open", since=w["at"][:19])
        items = _all(root)
        items.append({"subject": subject, "at": at, "ended": None, **(where or {})})
        state.put(root, KEY, items)
    return True, say("opened", subject=subject)


def end(root: Path, subject: str, at: str, force: bool = False) -> tuple[bool, str]:
    # THE LOWERCASE IS FOR MATCHING, AND ONLY FOR MATCHING. `--force` reuses this argument
    # as prose — it is the note kept beside a forced close, and the only thing that survives
    # one — so the raw text is kept and the fold is applied where the comparison happens.
    said = " ".join((subject or "").split())
    subject = said.lower()
    if force:
        with state.locked(root):
            items = _all(root)
            closed = []
            for w in items:
                if not w.get("ended"):
                    w["ended"] = at
                    w["ended_note"] = said or "closed with --force"
                    closed.append(w["subject"])
            if closed:
                state.put(root, KEY, items)
        if not closed:
            return False, say("nothing_open")
        return True, say("forced", n=len(closed), subjects=closed)
    with state.locked(root):
        items = _all(root)
        for w in items:
            if not w.get("ended") and w["subject"].lower() == subject:
                w["ended"] = at
                state.put(root, KEY, items)
                return True, say("closed", subject=w["subject"])
    still = open_work(root)
    if not still:
        return False, say("nothing_open")
    return False, say("closes_nothing", subjects=_subjects(still))


def parked(w: dict) -> dict | None:
    got = w.get(PARK)
    return got if isinstance(got, dict) else None


def park(root: Path, why: str, at: str, on: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("park_why")
    with state.locked(root):
        items = _all(root)
        standing = [w for w in items if not w.get("ended")]
        if not standing:
            return False, say("nothing_to_park")
        if on:
            key = " ".join(on.split()).lower()
            picked = [w for w in standing if w["subject"].lower() == key]
            if not picked:
                return False, say("names_no_work", subjects=_subjects(standing))
        elif len(standing) > 1:
            return False, say("park_guess", names=[say("park_name", subject=s) for s in _subjects(standing)])
        else:
            picked = standing
        picked[0][PARK] = {"why": why, "at": at}
        picked[0].pop(AWAIT, None)   # parked work is not also waiting on a clock
        state.put(root, KEY, items)
    return True, say("parked", subject=picked[0]["subject"], why=why)


def awaiting(w: dict, now: float) -> dict | None:
    got = w.get(AWAIT)
    if not isinstance(got, dict):
        return None
    return got if now < float(got.get("until") or 0) else None


def expired(w: dict, now: float) -> dict | None:
    got = w.get(AWAIT)
    if not isinstance(got, dict):
        return None
    return got if now >= float(got.get("until") or 0) else None


def alive(pid: int) -> bool:
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
    what = " ".join((what or "").split())
    if not what:
        return False, say("await_what")
    if minutes <= 0:
        return False, say("no_timeout")
    with state.locked(root):
        items = _all(root)
        standing = [w for w in items if not w.get("ended")]
        if not standing:
            return False, say("nothing_to_wait")
        if on:
            key = " ".join(on.split()).lower()
            picked = [w for w in standing if w["subject"].lower() == key]
            if not picked:
                return False, say("names_no_work", subjects=_subjects(standing))
        elif len(standing) > 1:
            return False, say("await_guess", names=[say("await_name", subject=s) for s in _subjects(standing)])
        else:
            picked = standing
        picked[0][AWAIT] = {"what": what, "until": now + minutes * 60, "at": at,
                            "minutes": minutes, "agent": agent or None, "pid": pid or None}
        state.put(root, KEY, items)
    mins = int(minutes) if float(minutes).is_integer() else minutes
    who = named(picked[0][AWAIT])
    return True, (say("waiting", what=what, who=who, subject=picked[0]["subject"], mins=mins)
                  + say("ends_named" if who else "ends_on_write")
                  + (say("pid_watched") if pid else ""))


def named(got: dict) -> str:
    if not isinstance(got, dict):
        return ""
    if got.get("agent"):
        return say("named_agent", agent=got["agent"])
    if got.get("pid"):
        return say("named_pid", pid=got["pid"])
    return ""


def gone(w: dict) -> dict | None:
    got = w.get(AWAIT)
    if not isinstance(got, dict) or not got.get("pid"):
        return None
    return None if alive(got["pid"]) else got


def woke(root: Path, subject: str) -> None:
    with state.locked(root):
        items = _all(root)
        for w in items:
            if not w.get("ended") and w["subject"].lower() == subject.lower() and w.get(AWAIT):
                w.pop(AWAIT, None)
                state.put(root, KEY, items)
                return


def resumed(root: Path, owners: set) -> str | None:
    with state.locked(root):
        items = _all(root)
        for w in items:
            if w.get("ended") or not w.get(AWAIT) or w.get("session") not in owners:
                continue
            if named(w[AWAIT]):
                continue
            w.pop(AWAIT, None)
            state.put(root, KEY, items)
            return w["subject"]
    return None


def _receiving(items: list[dict], owners: set, on: str = "") -> dict | None:
    standing = [w for w in items if not w.get("ended")]
    mine = [w for w in standing if w.get("session") in owners] or (standing if len(standing) == 1 else [])
    if mine:
        return mine[-1]
    key = " ".join((on or "").split()).lower()
    named = [w for w in items if key and w.get("subject", "").lower() == key]
    return named[-1] if named else None


def owned_subject(root: Path, owners: set) -> str:
    target = _receiving(_all(root), owners)
    return target["subject"] if target else ""


def record_files(root: Path, owners: set, changes: list[dict], at: str, on: str = "") -> int:
    with state.locked(root):
        items = _all(root)
        target = _receiving(items, owners, on)
        if target is None or not changes:
            return 0
        files = target.setdefault("files", [])
        by_path = {f["path"]: f for f in files}
        for c in changes:
            f = by_path.get(c["path"])
            if f is None:
                f = by_path[c["path"]] = {"path": c["path"], "created": bool(c.get("created")), "added": 0, "removed": 0}
                files.append(f)
            f["added"] += int(c.get("added") or 0)
            f["removed"] += int(c.get("removed") or 0)
            f["at"] = at
        state.put(root, KEY, items)
        return len(changes)


def record_commits(root: Path, owners: set, commits: list[dict], at: str, on: str = "") -> int:
    with state.locked(root):
        items = _all(root)
        target = _receiving(items, owners, on)
        if target is None or not commits:
            return 0
        kept = target.setdefault("commits", [])
        known = {c["sha"] for c in kept}
        added = [{"sha": c["sha"], "subject": c.get("subject", ""), "at": at} for c in commits if c["sha"] not in known]
        kept.extend(added)
        state.put(root, KEY, items)
        return len(added)


def files_changed(w: dict) -> str:
    n = len(w.get("files") or [])
    return "" if not n else "1 file changed" if n == 1 else f"{n} files changed"


def note(root: Path, text: str, at: str, on: str | None = None) -> tuple[bool, str]:
    text = " ".join((text or "").split())
    if not text:
        return False, say("update_what")
    with state.locked(root):
        return _note(root, text, at, on)


def _note(root: Path, text: str, at: str, on: str | None) -> tuple[bool, str]:
    standing = open_work(root)
    if not standing:
        return False, say("no_work_for_update")
    if on:
        want = " ".join(on.split()).lower()
        match = [w for w in standing if w["subject"].lower() == want]
        if not match:
            return False, say("on_matches_nothing", subjects=_subjects(standing))
        target = match[0]
    elif len(standing) > 1:
        return False, say("update_guess", names=[say("update_name", subject=s) for s in _subjects(standing)])
    else:
        target = standing[0]

    items = _all(root)
    for w in items:
        if w is target or (not w.get("ended") and w["subject"] == target["subject"]):
            w.setdefault("notes", []).append({"at": at, "text": text})
            w.pop(AWAIT, None)   # progress arrived: whatever was awaited is no longer awaited
            w.pop(PARK, None)     # and work being written about is not set aside any more
            state.put(root, KEY, items)
            return True, say("filed", subject=target["subject"], n=len(w["notes"]))
    return False, say("vanished")
