from __future__ import annotations

import json
import time
from pathlib import Path

import state
from templates import render as fill

MESSAGES = {
    "claim_what": 'claim what? `journal claim "<environment>" "<why it is yours now>"` — `journal environments` lists them',
    "claim_why": 'a claim says why: `journal claim "{name}" "<why it is yours now>"` — the session that loses it is told '
                 "the reason, so there has to be one",
    "claim_none": 'no environment is called {name}; nothing to claim — `journal prepare "{name}"` makes one, '
                  '`journal switch "{name}"` takes it',
    "claim_free": '{name} was held by nobody, so there was nothing to take — this session is on it\n'
                  '  `journal switch "{name}"` would have done the same',
    "holder": "{sid} ({age})",
    "claimed": "claimed {name} from session {who:, }\n  why: {why}\n"
               "  that session is unbound now and is told at its next stop; nothing of the environment was deleted",
    "age_none": "not seen",
    "age_now": "active just now",
    "age_minute": "active 1m ago",
    "age_minutes": "active {n}m ago",
    "age_hours": "idle {n}h",
    "age_days": "idle {n}d",
    "page_none": "no environment is called {name}. `journal environments` lists them.",
    "page_held": "held by session {sessions:, }",
    "page_free": "free",
    "page_title": "ENVIRONMENT {name}",
    "page_sub": "{auto}{state}",
    "page_auto": "auto on · ",
    "read_first": "read first",
    "doc_parts": "{n} part(s)",
    "doc_files": "{n} file(s)",
    "doc_read": "read it: .journal/journal.py docs {n}",
    "what_stands": "what stands",
    "pin_doc": "→ {label}",
    "open_work": "open work",
    "work_line": "{subject}[ — last: {last}]",
    "todo_section_n": "to do, in order ({n})",
    "todo_section": "to do",
    "todo_hint": "Each has a brief: .journal/journal.py todos <n> prints it. Start one with todo start <n>.",
    "cmd_switch": 'journal switch "{name}"',
    "cmd_switch_what": "this session works it",
    "cmd_begin": 'journal --env="{name}" todo start {n}',
    "cmd_begin_what": "begin without switching",
    "switch_what": 'switch to what? `journal switch "<environment>"`, or `--back` — a name is letters, digits and '
                   "dashes; nothing of that was left",
    "kept_new": "{name} is new",
    "kept_counts": "{pins} pin(s), {open} open",
    "lost": "\n  {n} reminder(s) on `{was}` are not in force here: {texts:; }{more}",
    "taken": "{name} is taken by session {sid} ({age}), and one session works an environment — pick another name; "
             "`journal environments` shows who is where",
    "already_on": "this session is already on {name}",
    "switched_session": "this session is on {name} — {kept}\n  {was} is where it was; the project still starts on {start}{lost}",
    "already_start": "already on {name} — the project starts there",
    "others": "\n  running sessions bound elsewhere stay there:\n{rows:\n}"
              '\n  move one: `journal switch "{name}" --session=<id>`; all: `--all-sessions`',
    "other_row": "    {sid}…  on {env}",
    "switched_project": "the project starts on {name} now — {kept}{too}{lost}{note}",
    "session_too": "; this session too",
    "back_none": "no environment to go back to — nothing has been switched away from yet",
    "prepared_here": "{name} exists — open it from the list to work there",
    "remove_what": 'remove what? `journal environments remove "<name>"`',
    "remove_none": "no environment is called {name}; `journal environments` lists them",
    "remove_start": "{name} is where new sessions start, so it cannot be removed — point the project somewhere else "
                    'first: `journal switch "<other>" --project`',
    "remove_mine": 'this session is on {name} — switch away first: `journal switch "<other>"`, then '
                   '`journal environments remove "{name}"`',
    "remove_taken": "{name} is taken by session {sid} ({age}) — an environment under a running session is not removed; "
                    'wait for it, or move it with `journal switch "<other>" --session={sid}`',
    "remove_open": "{name} has open work — {subject} — and removing it would delete that work unended; "
                   'end it first: `journal work end "{subject}"`, or move the session that holds it',
    "held_what": "{pins} pin(s), {work} open work, {todos} open to-do(s)",
    "remove_confirm": "{name} holds {what}, and removing it DELETES them:\n"
                      '  journal environments remove "{name}" --yes\n'
                      "  the record keeps one line saying it existed and what it held; the pins, the\n"
                      "  work and the to-dos are gone. Move anything worth keeping first.\n"
                      "  its docs are not deleted: a doc scoped here becomes the project's, because an\n"
                      "  environment ending does not unmake what it settled",
    "stragglers": "\n  {n} stale session(s) were bound to it and are now bound to nothing",
    "removed": "{name} is removed — it held {what}, and they are deleted{note}",
}


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


#: The environment every project already has before anyone names one. An existing journal
#: becomes this on the first switch, with nothing to migrate — `current` simply defaults.
DEFAULT = "default"

CURRENT, PREVIOUS = "current", "previous"


BINDINGS = "runtime/bindings.map"   # {session stem: environment}; not a .json, so the prune of per-transcript files never touches it


def _bindings(root: Path) -> dict:
    f = root / BINDINGS
    if not f.is_file():
        return {}
    try:
        got = json.loads(f.read_text())
        return got if isinstance(got, dict) else {}
    except ValueError:
        return {}


#: WHO READS IT, AND WITHOUT THE LOCK. `current`, the launcher's nudger and the viewer all read
#: the bindings constantly and none of them takes the lock, so the file must never exist in a
#: half-written state: a reader landing in a truncate window parses nothing, `_bindings` answers
#: with an empty map, and for that instant every session in the project reads as unbound.
#: `state.write_json` replaces it in one step instead.
def bound(root: Path, stem: str | None) -> str | None:
    got = _bindings(root).get(stem) if stem else None
    return (state.slug(got) or "default") if got else None


def bind(root: Path, stem: str, track: str) -> None:
    if not stem:
        return
    track = state.slug(track) or "default"
    with state.locked(root):
        b = _bindings(root)
        b[stem] = track
        state.write_json(root / BINDINGS, b)


def unbind(root: Path, stem: str) -> None:
    if not stem:
        return
    with state.locked(root):
        b = _bindings(root)
        if stem in b:
            del b[stem]
            state.write_json(root / BINDINGS, b)


def claim(root: Path, name: str, at: str, stem: str, why: str,
          stale_hours: float = 24.0) -> tuple[bool, str]:
    name = state.slug(name)
    if not name:
        return False, say("claim_what")
    why = (why or "").strip()
    if not why:
        return False, say("claim_why", name=name)
    if name not in _all(root):
        return False, say("claim_none", name=name)
    held = occupants(root, name, stem, stale_hours)
    for sid, age in held:
        unbind(root, sid)
        state.put(root, "claimed_away",
                  {"track": name, "by": stem or "", "why": why, "at": at, "age": age_text(age)},
                  stem=sid)
        # ITS OLD SITUATION IS NO LONGER ITS SITUATION. `track_due` is the hold saying the
        # environment it is on is held by somebody else; the session is on no environment
        # now, so that hold is about a place it has left. Left standing it fires ahead of
        # the claim's own note and the session is told the wrong thing first.
        state.put(root, "track_due", None, stem=sid)
    # UNDER THE LOCK, LIKE ITS SIBLING IN `remove`. Read, append, write is three steps, and two
    # claims landing together lose one of them — a claim nobody can find the record of.
    with state.locked(root):
        claims = state.get(root, "claims", []) or []
        claims.append({"track": name, "by": stem or "", "at": at, "why": why,
                       "from": [sid for sid, _ in held]})
        state.put(root, "claims", claims[-50:])
    ok, msg = switch(root, name, at, stem=stem, exclusive=False, stale_hours=stale_hours)
    if not ok:
        return False, msg
    if not held:
        return True, say("claim_free", name=name)
    who = [say("holder", sid=sid[:8], age=age_text(age)) for sid, age in held]
    return True, say("claimed", name=name, who=who, why=why)


def prune(root: Path, keep) -> None:
    b = _bindings(root)
    gone = [sid for sid in b if not keep(sid)]
    if not gone:
        return
    with state.locked(root):
        b = _bindings(root)
        for sid in gone:
            b.pop(sid, None)
        state.write_json(root / BINDINGS, b)


def live(root: Path, stale_hours: float = 24.0) -> dict[str, dict]:
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
    got = [(sid, v["age"]) for sid, v in live(root, stale_hours).items() if v["track"] == track and sid != stem]
    return sorted(got, key=lambda x: x[1])


def age_text(seconds: float | None) -> str:
    if seconds is None:
        return say("age_none")
    if seconds < 60:
        return say("age_now")
    if seconds < 3600:
        return say("age_minute") if seconds < 120 else say("age_minutes", n=int(seconds // 60))
    if seconds < 86400:
        return say("age_hours", n=f"{seconds / 3600:.1f}")
    return say("age_days", n=f"{seconds / 86400:.1f}")


_OVERRIDE: list = []


def override(name: str) -> None:
    _OVERRIDE[:] = [name] if name else []


def start(root: Path) -> str:
    return state.get(root, CURRENT, DEFAULT) or DEFAULT


def current(root: Path, stem: str | None = None) -> str:
    if _OVERRIDE:
        return _OVERRIDE[0]
    if stem is None:
        return start(root)
    got = bound(root, stem)
    if got:
        return got
    # `bind_on_start` IS THE PROJECT CHOOSING, NOT A DEFAULT: it says every session belongs
    # on the start environment, so a session under it is answered with it whether or not the
    # hook has written the binding yet. Without it there is nothing to answer with.
    import settings
    return start(root) if settings.load(root)[0]["bind_on_start"] else ""


SESSIONS = "sessions"
MARKS = "session_marks"


def carried_by(root: Path) -> dict[str, list[str]]:
    got = state.get(root, SESSIONS, {})
    return got if isinstance(got, dict) else {}


def marks(root: Path) -> dict[str, list[list]]:
    got = state.get(root, MARKS, {})
    return got if isinstance(got, dict) else {}


def carried(root: Path, track: str, stem: str, line: int = 0) -> None:
    if not stem:
        return
    with state.locked(root):
        idx = carried_by(root)
        have = idx.get(track) or []
        if stem not in have:
            idx[track] = have + [stem]
            state.put(root, SESSIONS, idx)
        if line:
            got = marks(root)
            mine = got.get(stem) or []
            if not mine or mine[-1][0] != track:
                got[stem] = mine + [[track, line]]
                state.put(root, MARKS, got)


def _all(root: Path) -> dict:
    data = state._record(root)
    got = data.get("tracks")
    # a copy: the record is shared by the server's threads, and a list read while a removal writes must not change under it
    got = dict(got) if isinstance(got, dict) else {}
    cur = data.get("current") or DEFAULT
    got.setdefault(cur, {})
    return got


def create(root: Path, *names: str, at: str = "") -> None:
    data = state._record(root)
    held = data.setdefault("tracks", {})
    if not isinstance(held, dict):
        held = data["tracks"] = {}
    before = len(held)
    fresh = []
    for name in names:
        if name and name not in held:
            fresh.append(name)
        if name:
            held.setdefault(name, {"at": at})
    if len(held) != before:
        # A NEW ENVIRONMENT IS WORKED FROM THE VIEWER. The user asked for this on by default; the
        # default lives HERE, where an environment starts, rather than in `viewer_first`'s fallback —
        # flipping that would turn it on for every environment in every project that has one already,
        # including terminal-only ones, which is not what "by default" was asked for.
        got = data.get(VIEWER_FIRST)
        got = got if isinstance(got, dict) else {}
        for name in fresh:
            got.setdefault(name, True)
        data[VIEWER_FIRST] = got
        state.write_json(state.record_file(root), data)


def choices(root: Path) -> list[str]:
    home = start(root)
    return sorted(_all(root), key=lambda n: (n != home, n))


def page(root: Path, name: str, width: int | None = None, commands: bool = True) -> tuple[bool, str]:
    import docs as docs_mod
    import fmt
    import todo as todo_mod
    width = fmt.room(width)
    name = state.slug(name)
    if name not in _all(root):
        return False, say("page_none", name=name)
    saved = list(_OVERRIDE)
    override(name)
    try:
        held = _all(root).get(name, {})
        numbered = [(i, p) for i, p in enumerate(state.tracked(root, "pins", name, []) or [], 1)
                    if not p.get("struck")]
        pins = [p for _, p in numbered]
        open_ = [w for w in (state.tracked(root, "work", name, []) or []) if not w.get("ended")]
        items = todo_mod.open_items(root, name)
        auto = todo_mod.auto(root, name)
        cited = sorted({str(p.get("doc")).split(".")[0] for p in pins if p.get("doc")}
                       | {str(t.get("doc")).split(".")[0] for t in items if t.get("doc")})
        mine = [d for d in docs_mod._load(root) if d.get("track") == name or str(d["n"]) in cited]
        who = [sid for sid, v in live(root).items() if v["track"] == name]
        by = []
        state_ = ("" if by
                  else say("page_held", sessions=[s[:8] for s in who]) if who else say("page_free"))
        out = [fmt.title(say("page_title", name=name),
                         sub=say("page_sub", auto=say("page_auto") if auto else "", state=state_)), ""]
        if mine:
            out.append(fmt.section(say("read_first")))
            for d in mine:
                files = docs_mod.attachments(d)
                out.append(fmt.numbered(d["n"], d["title"], " · ".join(x for x in [
                    d.get("status", "draft"), say("doc_parts", n=len(d["parts"])) if d["parts"] else "",
                    say("doc_files", n=len(files)) if files else "", say("doc_read", n=d["n"])] if x), width=width))
                out.append(fmt.wrap(d.get("abstract", ""), indent=5, width=width))
        if pins:
            out.append(fmt.section(say("what_stands")))
            for i, p in numbered:   # the same numbers `journal pins`, `strike` and `--supersedes` use
                label = say("pin_doc", label=docs_mod.ref_label(root, str(p["doc"]), short=True)) if p.get("doc") else ""
                out.append(fmt.numbered(i, p["fact"], label, width=width))
        if open_:
            out.append(fmt.section(say("open_work")))
            for w in open_:
                last = w["notes"][-1]["text"] if w.get("notes") else None
                out.append(fmt.wrap(say("work_line", subject=w["subject"], last=last), width=width))
        out.append(fmt.section(say("todo_section_n", n=len(items)) if items else say("todo_section")))
        out.append(todo_mod.render(root, name, width=width, short_refs=True))
        if items:
            out.append("")
            out.append(fmt.wrap(say("todo_hint"), width=width))
        out.append("")
        if not commands:
            return True, "\n".join(out).rstrip()
        first = next((t for t in todo_mod.ready(root, name)), None)
        rows = [(say("cmd_switch", name=name), say("cmd_switch_what"))]
        if first:
            rows.append((say("cmd_begin", name=name, n=first["n"]), say("cmd_begin_what")))
        out.append(fmt.commands(rows))
        return True, "\n".join(out)
    finally:
        _OVERRIDE[:] = saved


def listing(root: Path, stem: str | None = None, stale_hours: float = 24.0) -> list[dict]:
    home = start(root)
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
            "start": name == home,
            "pins": len([p for p in (state.tracked(root, "pins", name, []) or []) if not p.get("struck")]),
            "open": len([w for w in (state.tracked(root, "work", name, []) or []) if not w.get("ended")]),
            "at": held.get("at", ""),
            "sessions": sorted(by_track.get(name, [])),
            "seen": {sid: age_text(alive[sid]["age"]) if sid in alive else "stale" for sid in by_track.get(name, [])},
        })
    out.sort(key=lambda t: (not t["current"], not t["start"], t["name"]))
    return out


def switch(root: Path, name: str, at: str, stem: str = "", project: bool = False,
           exclusive: bool = True, stale_hours: float = 24.0, line: int = 0) -> tuple[bool, str]:
    name = state.slug(name)
    if not name:
        return False, say("switch_what")
    with state.locked(root):
        tracks = _all(root)
        fresh = name not in tracks
        home = start(root)
        if fresh or home not in state._record(root).get("tracks", {}):
            # the environment left behind exists by name too; the registry says both do,
            # and each one's folder holds what belongs to it
            create(root, home, name, at=at)
        held = tracks.get(name, {})
        # READ THE ENVIRONMENT'S OWN FILES, not the registry. 1.34.0 moved pins and work out
        # of `tracks.<name>` into `environments/<name>/`, and updated every call site that
        # needed these counts — `page`, `listing`, `_held_summary` — except this one, three
        # hunks below in the same file, in the same commit. It has printed "0 pin(s), 0
        # open" for every switch since, on environments holding both.
        kept = say("kept_new", name=name) if fresh else say(
            "kept_counts",
            pins=len([p for p in (state.tracked(root, "pins", name, []) or []) if not p.get("struck")]),
            open=len([w for w in (state.tracked(root, "work", name, []) or []) if not w.get("ended")]))
        bound_before = bound(root, stem)   # None while the session has chosen nothing
        was = current(root, stem)
        # WHAT THE SWITCH SILENCES, said at the moment it silences it. Reminders belong to
        # an environment, so leaving one turns every reminder on it off — and an agent
        # discovered that the hard way: it switched, seven guardrails went quiet, and it
        # noticed by chance. One line here is the whole fix, and it names the environment
        # being LEFT, which is the half no other line in this function looks at.
        silenced = [r for r in (state.tracked(root, "reminders", was, []) or [])
                    if not r.get("done")] if was and was != name else []
        lost = say("lost", n=len(silenced), was=was, texts=[r["text"][:60] for r in silenced[:2]],
                   more=" …" if len(silenced) > 2 else "") if silenced else ""
        if stem and exclusive and bound_before != name:
            taken = occupants(root, name, stem, stale_hours)
            if taken:
                return False, say("taken", name=name, sid=taken[0][0][:8], age=age_text(taken[0][1]))
        if stem and not project:
            if was == name and bound(root, stem):
                return False, say("already_on", name=name)
            bind(root, stem, name)
            # WHERE IT WAS IS NOWHERE, for a session that had not chosen yet: `bound` is
            # None and that is what is recorded, so `--back` has nothing to go back to
            # rather than an environment the session never chose.
            state.put(root, "previous_track", bound_before, stem=stem)
            carried(root, name, stem, line)
            return True, say("switched_session", name=name, kept=kept, was=was,
                             start=start(root), lost=lost)
        if stem:
            bind(root, stem, name)
            state.put(root, "previous_track", bound_before, stem=stem)
        if home == name and not stem:
            return False, say("already_start", name=name)
        state.put(root, PREVIOUS, home)
        state.put(root, CURRENT, name)
        carried(root, name, stem, line)
    others = {sid: t for sid, t in _bindings(root).items() if t != name and sid != stem}
    note = ""
    if others:
        note = say("others", name=name,
                   rows=[say("other_row", sid=sid[:8], env=t) for sid, t in sorted(others.items())])
    return True, say("switched_project", name=name, kept=kept, too=say("session_too") if stem else "",
                     lost=lost, note=note)


def move_sessions(root: Path, name: str, which: list[str] | None,
                  exclusive: bool = True, stale_hours: float = 24.0) -> tuple[list[str], list[str]]:
    name = state.slug(name)
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
        return False, say("back_none")
    return switch(root, was, at, stem, project=not stem, exclusive=exclusive, stale_hours=stale_hours)


REMOVED = "removals"          # the record's log of what was taken away, and by whom


def _held_summary(root: Path, name: str, held: dict) -> tuple[int, int, int]:
    import todo as todo_mod
    pins = len([p for p in state.tracked(root, "pins", name, []) or [] if not p.get("struck")])
    work = len([w for w in state.tracked(root, "work", name, []) or [] if not w.get("ended")])
    todos = len(todo_mod.open_items(root, name))
    return pins, work, todos


def remove(root: Path, name: str, at: str, stem: str = "", yes: bool = False,
           stale_hours: float = 24.0) -> tuple[bool, str]:
    import shutil
    import todo as todo_mod
    name = state.slug(name)
    if not name:
        return False, say("remove_what")
    tracks = _all(root)
    if name not in tracks:
        return False, say("remove_none", name=repr(name))
    home = start(root)
    if name == home:
        return False, say("remove_start", name=name)
    if bound(root, stem) == name:
        return False, say("remove_mine", name=name)
    taken = occupants(root, name, stem, stale_hours)
    if taken:
        return False, say("remove_taken", name=name, sid=taken[0][0][:8], age=age_text(taken[0][1]))
    # OPEN WORK IS SOMEBODY MID-SENTENCE. The count in the confirmation was meant to make the loss
    # visible, and an agent still typed --yes past "1 open work" — its own, opened before it
    # switched away. A removal is not how work ends; ending it is one command.
    opened = [w for w in state.tracked(root, "work", name, []) or [] if not w.get("ended")]
    if opened:
        return False, say("remove_open", name=name, subject=opened[0]["subject"])
    pins, work, todos = _held_summary(root, name, tracks.get(name, {}))
    what = say("held_what", pins=pins, work=work, todos=todos)
    if not yes:
        return False, say("remove_confirm", name=name, what=what)
    with state.locked(root):
        data = state._record(root)
        (data.get("tracks") or {}).pop(name, None)
        if data.get(PREVIOUS) == name:
            data.pop(PREVIOUS, None)   # `--back` must not walk into a name that is gone
        auto = data.get("auto")
        if isinstance(auto, dict):
            auto.pop(name, None)
        sessions = data.get("sessions")
        if isinstance(sessions, dict):
            sessions.pop(name, None)
        # EVERYTHING KEYED BY THE NAME GOES, or an environment made under that name again
        # inherits the last one's settings. `session_marks` is which stretch of which transcript
        # belonged to it — the thing that made a reused name come back holding somebody else's
        # history — and `viewer_first` is a preference the new one never expressed.
        for key in (VIEWER_FIRST, MARKS):
            got = data.get(key)
            if isinstance(got, dict):
                if key == MARKS:
                    for stem, marks in list(got.items()):
                        got[stem] = [m for m in marks if not (isinstance(m, dict) and m.get("track") == name)]
                else:
                    got.pop(name, None)
        log = data.get(REMOVED) or []
        log.append({"track": name, "by": stem or "", "at": at,
                    "pins": pins, "work": work, "todos": todos})
        data[REMOVED] = log[-50:]
        state.write_json(state.record_file(root), data)
        # BOTH LAYOUTS, UNCONDITIONALLY. `home` is the folder an environment is today and
        # `folder` the to-dos of one from before 1.34.0. Removing both every time is what
        # makes this one path: the old code branched on which existed, and the branch was
        # the bug — `environments/<name>/` is created lazily, so a removal seconds apart
        # could take either one.
        for d in (state.env_dir(root, name), todo_mod.folder(root, name)):
            if d.is_dir():
                shutil.rmtree(d, ignore_errors=True)
        # and the to-do ledger under runtime/, which is a cache of a folder that no longer exists
        todo_mod._index_file(root, name).unlink(missing_ok=True)
    # A STALE SESSION'S BINDING WOULD OUTLIVE THE ENVIRONMENT, and `current` would hand it a
    # name that is gone; unbind those, so they choose again the way a new session does.
    b = _bindings(root)
    stragglers = [sid for sid, t in b.items() if t == name]
    for sid in stragglers:
        unbind(root, sid)
    note = say("stragglers", n=len(stragglers)) if stragglers else ""
    return True, say("removed", name=name, what=what, note=note)


VIEWER_FIRST = "viewer_first"


def viewer_first(root: Path, track: str) -> bool:
    got = state.get(root, VIEWER_FIRST, {})
    return bool(got.get(track)) if isinstance(got, dict) else False


def set_viewer_first(root: Path, track: str, on: bool) -> None:
    with state.locked(root):
        got = state.get(root, VIEWER_FIRST, {})
        got = got if isinstance(got, dict) else {}
        got[track] = bool(on)
        state.put(root, VIEWER_FIRST, got)
