#!/usr/bin/env python3
"""migrate — what a new version has to do to a record an older version wrote.

    journal migrate            what is pending, and what has run
    journal migrate run        run what is pending

WHY IT IS A LIST AND NOT A SCRIPT. A consumer upgrades from whatever version it happens to
be on, which is never the version before this one — a project pulled six weeks ago crosses
four releases in one `journal upgrade`. So a migration names the version it belongs to, and
every migration newer than the record's own version runs, in order. The record remembers
how far it has got (`schema`), not what it has seen.

IT RUNS ITSELF. Not on a flag, not in a README step somebody skips: `ensure` is called at
the top of the CLI and of the hook, and it costs one dict lookup when there is nothing to
do. The package is copied into consumers by file, not installed by a package manager, so
"the upgrade command ran it" is not a guarantee anybody has — the guarantee is that the
first process to notice does it.

EVERY MIGRATION IS IDEMPOTENT AND SURVIVES A CRASH. It moves what it finds and leaves what
it does not, so running it twice is a no-op and running half of it and dying leaves the
other half to the next run. Nothing is deleted: what moves is copied and then unlinked,
and a shape the new code can no longer read is the only thing that may go.
"""
from __future__ import annotations

import shutil
from pathlib import Path

import state
import update
from templates import render as fill

SCHEMA = "schema"          # the version whose migrations have all run
_RAN: set = set()          # this process has already checked, per root


def _environment_folders(root: Path) -> list[str]:
    """1.34.0 — pins, work and to-dos move into `.journal/environments/<name>/`."""
    said = []
    data = state._record(root)
    held = data.get("tracks")
    if not isinstance(held, dict):
        held = {}
    for name in list(held) or ["default"]:
        slug = state.slug(name) or "default"
        moved = []
        entry = held.get(name) if isinstance(held.get(name), dict) else {}
        for key in state.TRACKED:
            if key not in entry:
                continue
            f = state._tracked_file(root, slug, key)
            have = state._read(f).get(key) if f.is_file() else None
            # NEVER OVERWRITE, NEVER DROP. A half-migrated project — one the file already
            # exists in — must not lose what the record still holds, and must not keep it
            # either, or the two disagree forever. Append what is not already there.
            merged = (have + [x for x in entry[key] if x not in have]) if have else entry[key]
            f.parent.mkdir(parents=True, exist_ok=True)
            state._write(f, {key: merged})
            moved.append(say("moved_key", key=key, n=len(entry[key])))
            entry.pop(key)
        was = root / "todo" / slug
        now = state.env_dir(root, slug) / "todo"
        if was.is_dir() and not now.exists():
            now.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(was), str(now))
            moved.append(say("moved_todos", n=len(list(now.glob("*.md")))))
        if moved:
            said.append(say("env_moved", env=slug, moved=moved))
    state._write(state.record_file(root), data)
    old = root / "todo"
    if old.is_dir() and not any(old.iterdir()):
        old.rmdir()
    return said or [say("nothing_moved")]



MESSAGES = {
    "pin_body_moved": "  pin reasoning {name} moved from `{was}` to `{env}`, the environment its pin is on",
    "no_pin_body": "  every pin's reasoning is already in its own environment's folder",
    "moved_key": "{key} ({n})",
    "moved_todos": "to-dos ({n})",
    "env_moved": "  {env}: {moved:, }",
    "nothing_moved": "  nothing to move — already one folder per environment",
    "doc_moved": "  doc {n} was `{was}`, now the project's — {title}",
    "no_doc": "  no doc carries a track from before scope meant scope",
    "question_moved": "  {env}: to-do {n}'s question is question {q}",
    "no_question": "  no to-do carried a question in its own file",
    "files_moved": "  {env}: a message's attachments are under message-files now ({n} message(s))",
    "no_files_moved": "  no attachments were filed under the old name",
    "ran": "{version}: {what}",
    "report_head": "MIGRATIONS  the record is at {done}; the package is at {package}",
    "report_row": "{mark} {version}  {what}",
    "pending": "  {n} pending — `journal migrate run`, or the next command runs them",
    "none_pending": "  Nothing pending. They run themselves after an upgrade.",
}

def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


#: WHEN 1.44.0 SHIPPED, in UTC, from its own tag. Every doc written before this had `track:`
#: filled in as PROVENANCE — which line of work it came out of — and every doc written after
#: had it chosen as SCOPE. The field is the same; only the intent behind a value differs, and
#: the timestamp is the only thing that separates the two populations.
SCOPE_ERA = "2026-09-10T00:07:01+00:00"


def _docs_written_as_provenance(root: Path) -> list[str]:
    """1.52.0 — a doc written before 1.44.0 keeps its `track:` as a note, not as a scope.

    1.44.0 TURNED `track:` FROM PROVENANCE INTO SCOPE and concluded the migration was
    nothing: "a doc with no track at all is treated as global, which is what every doc
    written before this release has." That is false for any version that filled the field
    in, and they all did. So docs silently stopped being listed on every environment but one:
    in this project both docs were invisible on three of four environments; in another, 88
    docs existed and the default environment's catalogue counted 85.

    WHY THE CUT IS A TIMESTAMP AND NOT THE FIELD. Three repairs were possible: make every
    tracked doc global, which also un-scopes the ones somebody chose deliberately after
    1.44.0; leave them, which keeps the harm; or use `at:`, which separates "the field was
    provenance" from "somebody chose this scope" exactly. The last one's worst case is a
    pre-1.44.0 doc whose track happened to be the right scope becoming visible everywhere
    instead of in one place — over-visibility, undone by one `journal docs move`. The other
    two are wrong in the lossy direction.

    IT SAYS WHAT IT MOVED, per doc. A migration that changes what a reader can see and
    reports a number is the same defect one level up.
    """
    import docs as docs_mod
    said = []
    for d in docs_mod._load(root):
        at_text = (d.get("at") or "").strip()
        if not at_text or at_text >= SCOPE_ERA:
            continue
        if docs_mod.scope_of(d) == docs_mod.GLOBAL:
            continue
        was = d["track"]
        ok, _ = docs_mod.move(root, str(d["n"]), docs_mod.GLOBAL)
        if ok:
            said.append(say("doc_moved", n=d["n"], was=was, title=d["title"][:60]))
    return said or [say("no_doc")]


def _todo_questions(root: Path) -> list[str]:
    import questions
    import todo
    said = []
    envs = root / state.ENVS
    folders = sorted(p for p in envs.iterdir() if (p / todo.DIR).is_dir()) if envs.is_dir() else []
    for env in folders:
        f = state._tracked_file(root, env.name, questions.KEY)
        for path in sorted((env / todo.DIR).glob("*.md")):
            meta = todo._read_todo(path)
            if "asks" not in meta and "answer" not in meta:
                continue
            asked, answered = meta.get("asks", "").strip(), meta.get("answer", "").strip()
            ref = f"todo:{meta['n']}"
            if asked:
                items = (state._read(f).get(questions.KEY) if f.is_file() else None) or []
                if not any(q.get("text") == asked and ref in (q.get("links") or []) for q in items):
                    items.append({"text": asked, "at": meta.get("at", ""), "source": "migrated",
                                  "links": [ref], "answer": answered or None, "answered_at": None,
                                  "told_at": None, "withdrawn": None})
                    f.parent.mkdir(parents=True, exist_ok=True)
                    state._write(f, {questions.KEY: items})
                    said.append(say("question_moved", env=env.name, n=meta["n"], q=len(items)))
            todo._write(path, meta, meta["body"])
    return said or [say("no_question")]


def _pin_bodies_home(root: Path) -> list[str]:
    # an older body_dir filed reasoning under the start environment; a file moves only when
    # exactly one environment's pins name it and exactly one other folder holds it
    import pins
    envs = root / state.ENVS
    folders = sorted(p for p in envs.iterdir() if p.is_dir()) if envs.is_dir() else []
    owners: dict[str, list[str]] = {}
    for env in folders:
        f = state._tracked_file(root, env.name, pins.KEY)
        for p in (state._read(f).get(pins.KEY) if f.is_file() else None) or []:
            if p.get("body"):
                owners.setdefault(p["body"], []).append(env.name)
    said = []
    for name, named in sorted(owners.items()):
        if len(named) != 1:
            continue
        target = pins.body_dir(root, pins.KEY, track=named[0]) / name
        if target.is_file():
            continue
        strays = [pins.body_dir(root, pins.KEY, track=env.name) / name for env in folders if env.name != named[0]]
        strays = [s for s in strays if s.is_file()]
        if len(strays) != 1:
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(strays[0]), str(target))
        said.append(say("pin_body_moved", name=name, was=strays[0].parent.parent.name, env=named[0]))
    return said or [say("no_pin_body")]


def _message_files(root: Path) -> list[str]:
    """1.138.0 — a message's attachments move from `inbox-files/` to `message-files/`.

    THE DIRECTORY HELD REAL FILES, so the rename could not be a constant change alone: the URL
    moved first (`/message-files/<env>/<n>/<name>`) and this brings the bytes with it. An
    environment that somehow holds both shapes is left alone rather than merged blindly — a
    migration that loses an attachment is worse than one that skips a case nobody has.
    """
    import inbox
    envs = root / state.ENVS
    folders = sorted(p for p in envs.iterdir() if p.is_dir()) if envs.is_dir() else []
    said = []
    for env in folders:
        was, now = env / "inbox-files", env / inbox.FILES
        if not was.is_dir() or now.exists():
            continue
        shutil.move(str(was), str(now))
        said.append(say("files_moved", env=env.name, n=len([x for x in now.iterdir() if x.is_dir()])))
    return said or [say("no_files_moved")]


#: (the version it belongs to, what it does, the function). Ordered oldest first.
MIGRATIONS: list[tuple[str, str, object]] = [
    ("1.34.0", "pins, work and to-dos move into each environment's own folder",
     _environment_folders),
    ("1.52.0", "a doc written before 1.44.0 carried provenance in `track:`, not a scope",
     _docs_written_as_provenance),
    ("1.62.0", "a to-do's question and answer move out of its file into questions",
     _todo_questions),
    ("1.64.1", "a pin's reasoning file moves to the environment its pin is on", _pin_bodies_home),
    ("1.138.0", "a message's attachments move from inbox-files to message-files", _message_files),
]


def at(root: Path) -> str:
    """The version whose migrations have all run against this record."""
    return state.get(root, SCHEMA, "") or "0.0.0"


def pending(root: Path) -> list[tuple]:
    """Every migration newer than the record — the ones that have not run here."""
    done = at(root)
    return [m for m in MIGRATIONS if update.newer(m[0], done)]


def run(root: Path) -> list[str]:
    """Run what is pending, oldest first, recording how far it got after each one."""
    out = []
    for version, what, fn in pending(root):
        out.append(say("ran", version=version, what=what))
        out.extend(fn(root))
        state.put(root, SCHEMA, version)
    return out


def ensure(root: Path) -> list[str]:
    """The cheap guard every entry point calls. Silent and free when there is nothing to do.

    THE VERSION IS ALSO WRITTEN WHEN NOTHING RUNS, so a project installed fresh at 1.34.0
    does not walk the list again on its next call — and so a migration added later still
    sees a record that says which version wrote it.
    """
    key = str(root)
    if key in _RAN:
        return []
    _RAN.add(key)
    if not MIGRATIONS:
        return []
    if not pending(root):
        return []
    if not state.record_file(root).is_file():   # nothing written yet: nothing to migrate
        state.put(root, SCHEMA, MIGRATIONS[-1][0])
        return []
    with state.locked(root):
        return run(root)


def report(root: Path) -> str:
    """What has run and what has not."""
    done, left = at(root), pending(root)
    lines = [say("report_head", done=done, package=update.current(root)), ""]
    for version, what, _ in MIGRATIONS:
        mark = "  ·" if any(version == v for v, _, _ in left) else "  ✓"
        lines.append(say("report_row", mark=mark, version=version, what=what))
    lines.append("")
    lines.append(say("pending", n=len(left)) if left else say("none_pending"))
    return "\n".join(lines)
