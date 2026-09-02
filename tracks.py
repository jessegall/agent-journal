"""One journal, several tracks of work — and none of them a Claude Code session.

A TRACK IS NOT A SESSION. A session belongs to the harness: it starts when somebody opens
a terminal, it ends when they close it, and its id means nothing to anyone else. A track
is what the WORK is called, so a new agent joins whichever one is current without knowing
anything about how it got there, and the same track survives any number of sessions,
compactions and restarts.

PARKED, NEVER CLOSED. Switching away keeps everything exactly as it stood — its pins, its
open work, its notes — and switching back finds it unchanged. There is no delete: the tool
this replaces dropped things quietly to stay tidy, and the whole point here is that nothing
disappears without somebody deciding it should.

THE SWAP IS THE IMPLEMENTATION, and it is deliberate. `pins` and `work` keep meaning "the
current thread's pins and work", so every other module keeps reading exactly what it read
before and none of them learn a new concept. Switching parks the live pair under the old
name and lifts the new pair into its place. A design where `pins.py` had to know about
tracks would have put the same idea in five files.
"""
from __future__ import annotations

import json
import time
from pathlib import Path

import state

#: The track every project already has before anyone names one. An existing journal
#: becomes this on the first switch, with nothing to migrate — `current` simply defaults.
DEFAULT = "default"

CURRENT, PARKED, PREVIOUS = "current", "tracks", "previous"


BINDINGS = "runtime/bindings.map"   # {session stem: track}; not a .json, so the prune of per-transcript files never touches it


def _bindings(root: Path) -> dict:
    f = root / BINDINGS
    if not f.is_file():
        return {}
    try:
        got = json.loads(f.read_text())
        return got if isinstance(got, dict) else {}
    except ValueError:
        return {}


def bound(root: Path, stem: str | None) -> str | None:
    return _bindings(root).get(stem) if stem else None


def bind(root: Path, stem: str, track: str) -> None:
    """Bind one session to a track. The record's `current` is untouched."""
    if not stem:
        return
    with state.locked(root):
        b = _bindings(root)
        b[stem] = track
        (root / BINDINGS).parent.mkdir(parents=True, exist_ok=True)
        (root / BINDINGS).write_text(json.dumps(b, indent=2) + "\n")


def unbind(root: Path, stem: str) -> None:
    if not stem:
        return
    with state.locked(root):
        b = _bindings(root)
        if stem in b:
            del b[stem]
            (root / BINDINGS).write_text(json.dumps(b, indent=2) + "\n")


def prune(root: Path, keep) -> None:
    """Drop the binding of every session `keep(stem)` says is gone."""
    b = _bindings(root)
    gone = [sid for sid in b if not keep(sid)]
    if not gone:
        return
    with state.locked(root):
        b = _bindings(root)
        for sid in gone:
            b.pop(sid, None)
        (root / BINDINGS).write_text(json.dumps(b, indent=2) + "\n")


def live(root: Path, stale_hours: float = 24.0) -> dict[str, dict]:
    """{stem: {track, age}} for every bound session still counted as running.

    RUNNING IS EVIDENCE, NOT A COUNTER: not ended by a SessionEnd, and seen by a hook event
    within `stale_hours`. A terminal closed without a SessionEnd goes stale and frees its
    track; one that sits idle waiting for its user for an hour is still running, because
    the user comes back to it.
    """
    now = time.time()
    out = {}
    for sid, track in _bindings(root).items():
        if state.get(root, "ended", None, stem=sid):
            continue
        seen = state.get(root, "seen_at", 0, stem=sid) or 0
        if not seen:
            f = state.runtime_file(root, sid)
            seen = f.stat().st_mtime if f.is_file() else 0
        age = now - seen if seen else None
        if age is None or age > stale_hours * 3600:
            continue
        out[sid] = {"track": track, "age": age}
    return out


def occupants(root: Path, track: str, stem: str | None, stale_hours: float = 24.0) -> list[tuple[str, float]]:
    """Other live sessions on `track`, most recently seen first: (stem, seconds since seen)."""
    got = [(sid, v["age"]) for sid, v in live(root, stale_hours).items() if v["track"] == track and sid != stem]
    return sorted(got, key=lambda x: x[1])


def age_text(seconds: float | None) -> str:
    if seconds is None:
        return "not seen"
    if seconds < 90:
        return "active just now"
    if seconds < 3600:
        return f"active {int(seconds // 60)} min ago"
    if seconds < 86400:
        return f"idle {seconds / 3600:.1f} h"
    return f"idle {seconds / 86400:.1f} d"


def current(root: Path, stem: str | None = None) -> str:
    """The track this session is on: its binding, else the project's start track.

    A SESSION IS BOUND TO A TRACK; THE PROJECT HAS A START TRACK. At session start the
    session is bound to the start track. A switch from inside a session moves that
    session only, so two sessions can work two tracks of one project at once; a switch
    from the terminal, or with --project, moves the start track for later sessions and
    leaves running ones where they are.
    """
    got = bound(root, stem)
    if got:
        return got
    return state.get(root, CURRENT, DEFAULT) or DEFAULT


SESSIONS = "sessions"


def carried_by(root: Path) -> dict[str, list[str]]:
    """{track: [session stems that were ever on it]} — the index `search` reads.

    A TRACK HAS A TRANSCRIPT, spread over every session that was on it. Without this,
    finding it means parsing every session the project ever had and segmenting each by
    its marks: correct, and growing with every session. So each session start records
    the session under the current track, and each switch records it under the track
    switched to. A session absent from every list predates the index and is read the
    long way, once, so nothing is lost while the index fills in.
    """
    got = state.get(root, SESSIONS, {})
    return got if isinstance(got, dict) else {}


def carried(root: Path, track: str, stem: str) -> None:
    """Record that `stem` was on `track`. Idempotent; a record write, under the lock."""
    if not stem:
        return
    with state.locked(root):
        idx = carried_by(root)
        have = idx.get(track) or []
        if stem in have:
            return
        idx[track] = have + [stem]
        state.put(root, SESSIONS, idx)


def _all(root: Path) -> dict:
    data = state._record(root)
    got = data.get("tracks")
    if not isinstance(got, dict):
        got = {}
    cur = data.get("current") or DEFAULT
    got.setdefault(cur, {})
    return got


def listing(root: Path, stem: str | None = None, stale_hours: float = 24.0) -> list[dict]:
    """Every track: the project's start track first, sessions bound to each, this one marked."""
    start = state.get(root, CURRENT, DEFAULT) or DEFAULT
    mine = current(root, stem)
    by_track: dict[str, list[str]] = {}
    for sid, t in _bindings(root).items():
        by_track.setdefault(t, []).append(sid)
    alive = live(root, stale_hours)
    out = []
    for name, held in _all(root).items():
        out.append({
            "name": name,
            "current": name == mine,
            "start": name == start,
            "pins": len([p for p in held.get("pins", []) if not p.get("struck")]),
            "open": len([w for w in held.get("work", []) if not w.get("ended")]),
            "at": held.get("at", ""),
            "sessions": sorted(by_track.get(name, [])),
            "seen": {sid: age_text(alive[sid]["age"]) if sid in alive else "stale" for sid in by_track.get(name, [])},
        })
    out.sort(key=lambda t: (not t["current"], not t["start"], t["name"]))
    return out


def switch(root: Path, name: str, at: str, stem: str = "", project: bool = False,
           exclusive: bool = True, stale_hours: float = 24.0) -> tuple[bool, str]:
    """Move this session to a track, or the project's start track, or both.

    NOTHING IS SWAPPED ANY MORE. Every track's pins and work live under its name; a
    switch only changes which name this process reads. A new track is a name with
    nothing under it yet. Nothing is ever deleted by switching.
    """
    name = " ".join((name or "").split())
    if not name:
        return False, 'switch to what? `journal switch "<track>"`, or `--back`'
    with state.locked(root):
        tracks = _all(root)
        fresh = name not in tracks
        start = state.get(root, CURRENT, DEFAULT) or DEFAULT
        if fresh or start not in state._record(root).get("tracks", {}):
            data = state._record(root)
            held_ = data.setdefault("tracks", {})
            if not isinstance(held_, dict):
                held_ = data["tracks"] = {}
            held_.setdefault(start, {"pins": [], "work": [], "at": at})   # the track left behind exists by name too
            held_.setdefault(name, {"pins": [], "work": [], "at": at})
            state._write(state.record_file(root), data)
        held = tracks.get(name, {})
        kept = f"{name} is new" if fresh else (
            f"{len([p for p in held.get('pins', []) if not p.get('struck')])} pin(s), "
            f"{len([w for w in held.get('work', []) if not w.get('ended')])} open")
        was = current(root, stem)
        if stem and exclusive and was != name:
            taken = occupants(root, name, stem, stale_hours)
            if taken:
                return False, (f"{name} is taken by session {taken[0][0][:8]} ({age_text(taken[0][1])}), and one "
                               "session works a track — pick another name; `journal tracks` shows who is where")
        if stem and not project:
            if was == name:
                return False, f"this session is already on {name}"
            bind(root, stem, name)
            state.put(root, "previous_track", was, stem=stem)
            carried(root, name, stem)
            return True, f"this session is on {name} — {kept}\n  {was} is where it was; the project still starts on {state.get(root, CURRENT, DEFAULT) or DEFAULT}"
        if stem:
            bind(root, stem, name)
            state.put(root, "previous_track", was, stem=stem)
        if start == name and not stem:
            return False, f"already on {name} — the project starts there"
        state.put(root, PREVIOUS, start)
        state.put(root, CURRENT, name)
        carried(root, name, stem)
    others = {sid: t for sid, t in _bindings(root).items() if t != name and sid != stem}
    note = ""
    if others:
        note = ("\n  running sessions bound elsewhere stay there:\n"
                + "\n".join(f"    {sid[:8]}…  on {t}" for sid, t in sorted(others.items()))
                + f"\n  move one: `journal switch \"{name}\" --session=<id>`; all: `--all-sessions`")
    return True, (f"the project starts on {name} now — {kept}" + (f"; this session too" if stem else "") + note)


def move_sessions(root: Path, name: str, which: list[str] | None,
                  exclusive: bool = True, stale_hours: float = 24.0) -> tuple[list[str], list[str]]:
    """Bind the named sessions (or every bound session) to `name`: (moved, refused).

    With one session per track, at most one live session lands on `name`: the one already
    there if any, else the first picked; the rest are refused and named.
    """
    b = _bindings(root)
    picked = [sid for sid in b if which is None or any(sid.startswith(w) for w in which)]
    refused: list[str] = []
    if exclusive:
        alive = live(root, stale_hours)
        holder = next((sid for sid, v in alive.items() if v["track"] == name), None)
        kept = []
        for sid in picked:
            if sid in alive and holder and sid != holder:
                refused.append(sid)
            else:
                kept.append(sid)
                if sid in alive and not holder:
                    holder = sid
        picked = kept
    for sid in picked:
        if b[sid] != name:
            state.put(root, "previous_track", b[sid], stem=sid)   # so `--back` in that session undoes the move
        bind(root, sid, name)
    return picked, refused


def back(root: Path, at: str, stem: str = "", exclusive: bool = True, stale_hours: float = 24.0) -> tuple[bool, str]:
    was = state.get(root, "previous_track", None, stem=stem) if stem else state.get(root, PREVIOUS)
    if not was:
        return False, "no track to go back to — nothing has been switched away from yet"
    return switch(root, was, at, stem, project=not stem, exclusive=exclusive, stale_hours=stale_hours)
