from __future__ import annotations

from pathlib import Path

import state
from pins import age
from templates import render

KEY = "reactions"

#: THE WHOLE SET. A reaction is a gesture, not a vocabulary: six are enough to mean yes, thanks,
#: nice, funny, seen and please — and a fixed set is one the other side can always render.
FACES = ("👍", "❤️", "🎉", "😄", "👀", "🙏")

MESSAGES = {
    "needs_turn": 'a reaction needs the turn it is on: journal react <message number> "👍"',
    "needs_face": "a reaction needs one of: {faces}",
    "not_a_face": "{face} is not one the viewer can draw; use one of: {faces}",
    "no_message": "there is no message {n} to react to",
    "left": "reacted {face} to message {n}",
    "took_back": "took the {face} off message {n}",
    "listed": "{face} by {by}[ {age}]",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def _all(root: Path, track: str | None = None) -> dict:
    got = state.tracked(root, KEY, track, {}) if track else state.get(root, KEY, {})
    return got if isinstance(got, dict) else {}


def _put(root: Path, held: dict, track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, held)
    else:
        state.put(root, KEY, held)


def on(root: Path, turn: str, track: str | None = None) -> list[dict]:
    got = _all(root, track).get(turn)
    return got if isinstance(got, list) else []


def all_of(root: Path, track: str | None = None) -> dict:
    """Every turn that carries a reaction, for the viewer to draw in one read."""
    return {k: v for k, v in _all(root, track).items() if isinstance(v, list) and v}


def leave(root: Path, turn: str, face: str, at: str, by: str = "agent",
          track: str | None = None) -> tuple[bool, str, bool]:
    """Put one on, or take it off when the same side leaves the same one again.

    A REACTION TOGGLES. It is the only write in the journal with no undo verb, because the gesture
    IS the undo: clicking the face you left is how it comes off, the way every chat does it.
    """
    turn = (turn or "").strip()
    # A NUMBER MEANS A MESSAGE. The agent writes `journal react 12 "👍"`; the viewer writes the turn's
    # own key. Both arrive here, and the shorthand is spelled out once, where it is stored.
    if turn.isdigit():
        turn = f"message:{turn}"
    face = (face or "").strip()
    if not turn:
        return False, say("needs_turn"), False
    if not face:
        return False, say("needs_face", faces=list(FACES)), False
    if face not in FACES:
        return False, say("not_a_face", face=repr(face), faces=list(FACES)), False
    with state.locked(root):
        held = _all(root, track)
        rows = [r for r in (held.get(turn) or []) if isinstance(r, dict)]
        mine = next((r for r in rows if r.get("by") == by and r.get("face") == face), None)
        if mine:
            rows.remove(mine)
            off = True
        else:
            rows.append({"face": face, "by": by, "at": at, "told_at": "" if by == "user" else at})
            off = False
        if rows:
            held[turn] = rows
        else:
            held.pop(turn, None)
        _put(root, held, track)
    return True, (say("took_back", face=face, n=_number(turn)) if off
                  else say("left", face=face, n=_number(turn))), off


def _number(turn: str) -> str:
    """The message number inside a turn key, or the key itself for a turn that has none."""
    parts = (turn or "").split(":")
    return parts[1] if len(parts) > 1 and parts[1].isdigit() and parts[1] != "0" else turn


def untold(root: Path, track: str | None = None) -> list[tuple[str, int, dict]]:
    """(turn, index, reaction) for every one the USER left that nobody has been told about.

    A THUMBS UP IS AN ANSWER. The user reacting to "I'll do this next" is confirming it, and a
    confirmation the agent never hears is the same as one never given — so a reaction of theirs is
    told the way a reply under a message is, once, and marked.
    """
    out = []
    for turn, rows in _all(root, track).items():
        for i, r in enumerate(rows if isinstance(rows, list) else []):
            if r.get("by") == "user" and not r.get("told_at"):
                out.append((turn, i, r))
    return out


def mark_told(root: Path, track: str | None, refs: list[tuple[str, int]], at: str) -> None:
    with state.locked(root):
        held = _all(root, track)
        for turn, i in refs:
            rows = held.get(turn) or []
            if 0 <= i < len(rows):
                rows[i]["told_at"] = at
        _put(root, held, track)


def facts(rows: list[dict]) -> str:
    return " · ".join(say("listed", face=r.get("face") or "", by=r.get("by") or "", age=age(r.get("at") or ""))
                      for r in rows)
