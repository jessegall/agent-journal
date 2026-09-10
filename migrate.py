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
            moved.append(f"{key} ({len(entry[key])})")
            entry.pop(key)
        was = root / "todo" / slug
        now = state.env_dir(root, slug) / "todo"
        if was.is_dir() and not now.exists():
            now.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(was), str(now))
            moved.append(f"to-dos ({len(list(now.glob('*.md')))})")
        if moved:
            said.append(f"  {slug}: " + ", ".join(moved))
    state._write(state.record_file(root), data)
    old = root / "todo"
    if old.is_dir() and not any(old.iterdir()):
        old.rmdir()
    return said or ["  nothing to move — already one folder per environment"]



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
            said.append(f"  doc {d['n']} was `{was}`, now the project's — {d['title'][:60]}")
    return said or ["  no doc carries a track from before scope meant scope"]


#: (the version it belongs to, what it does, the function). Ordered oldest first.
MIGRATIONS: list[tuple[str, str, object]] = [
    ("1.34.0", "pins, work and to-dos move into each environment's own folder",
     _environment_folders),
    ("1.52.0", "a doc written before 1.44.0 carried provenance in `track:`, not a scope",
     _docs_written_as_provenance),
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
        out.append(f"{version}: {what}")
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
    lines = [f"MIGRATIONS  the record is at {done}; the package is at {update.current(root)}", ""]
    for version, what, _ in MIGRATIONS:
        mark = "  ·" if any(version == v for v, _, _ in left) else "  ✓"
        lines.append(f"{mark} {version}  {what}")
    lines.append("")
    lines.append("  " + (f"{len(left)} pending — `journal migrate run`, or the next command runs them"
                         if left else "Nothing pending. They run themselves after an upgrade."))
    return "\n".join(lines)
