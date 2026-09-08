"""`.journal/record.json` and `.journal/runtime/<transcript>.json` — two kinds of fact.

THE RECORD IS SHARED. Pins, work, environments: what somebody decided. It belongs to the project,
survives a fresh clone, is the half worth reviewing in a diff, and every Claude Code session
and every agent inside one reads and writes the same file.

THE RUNTIME IS NOT. Where the untagged hold last fired, which context rung was announced,
the largest tool result so far, the floor under history the hook was not present for: each
of these is a LINE NUMBER OR A READING OF ONE TRANSCRIPT. Held at project scope they were
inherited by every later transcript — a session at line 53 carried `held_at: 1746` from the
one before it, so its untagged hold could not fire until line 1747, and a subagent's read
raised `biggest_result` in the parent's context. So the runtime is one small file per
transcript, keyed by the transcript's own name, and it is gitignored because it means
nothing in anybody else's checkout.

Which file a key lives in is DATA, not a rule to remember, because a rule about where to
write is one that is eventually written past.
"""
from __future__ import annotations

import contextlib
import json
import re
import os
import sys
import tempfile
import time
from pathlib import Path

RECORD = "record.json"
RUNTIME_DIR = "runtime"
LOCK = "record.json.lock"
#: The project-wide runtime file this replaced. Retired on sight, never read: its marks are
#: line numbers of unknown provenance, and guessing which transcript they belonged to would
#: write them into the session running the upgrade — the defect being fixed.
RETIRED = "state.json"

IN_RECORD = {"pins", "work", "rules", "tracks", "current", "previous", "sessions", "auto", "docs_next", "upgraded", "window", "claims", "removals", "cleanup_read", "schema"}


def is_record(key: str) -> bool:
    return key in IN_RECORD


def record_file(root: Path) -> Path:
    return root / RECORD


def runtime_file(root: Path, stem: str) -> Path:
    return root / RUNTIME_DIR / f"{stem}.json"


#: path -> (mtime_ns, size, data). ONE PROCESS, and validated by stat on every hit.
#: `_record` is read many times in a single command — by the gate, by the renderer, by
#: whatever the command itself does — and in a large consumer that is a 700KB parse each
#: time. A stat is not free but it is two orders of magnitude cheaper, and it keeps the
#: guarantee that matters: another process's write changes mtime or size, so the next read
#: here misses the cache and sees it.
_CACHE: dict = {}


def _read(f: Path) -> dict:
    try:
        st = f.stat()
    except OSError:
        return {}
    key = str(f)
    hit = _CACHE.get(key)
    if hit is not None and hit[0] == st.st_mtime_ns and hit[1] == st.st_size:
        return hit[2]
    try:
        data = json.loads(f.read_text())
        data = data if isinstance(data, dict) else {}
    except (ValueError, OSError):
        return {}  # a corrupt handle file must never stop the record being read
    _CACHE[key] = (st.st_mtime_ns, st.st_size, data)
    return data


def _write(f: Path, data: dict) -> None:
    """Atomic, and SAFE UNDER CONCURRENT WRITERS.

    The first version wrote `<name>.tmp` and replaced it. Two hooks writing at once — and
    parallel tool calls fire PostToolUse at once — shared that path, and one of them died
    with FileNotFoundError when the other's replace consumed the tmp. Reproduced: four
    writers, three tracebacks. A crashing hook is rendered to the user as a hook error. So
    every writer gets its own tmp, and the loser of a race is overwritten, not killed.
    """
    _CACHE.pop(str(f), None)
    f.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=f.parent, prefix=f".{f.name}.", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as fh:
            fh.write(json.dumps(data, indent=2) + "\n")
        os.replace(tmp, f)
    except BaseException:
        with contextlib.suppress(OSError):
            os.unlink(tmp)
        raise


def load(root: Path, name: str = RECORD) -> dict:
    """A whole file, by name relative to the root. `verify` reads runtime files this way."""
    return _read(root / name)


def runtime(root: Path, stem: str) -> dict:
    return _read(runtime_file(root, stem))


def runtime_files(root: Path) -> list[tuple[str, dict]]:
    """Every transcript's runtime marks, by stem. What `verify` counts as evidence."""
    d = root / RUNTIME_DIR
    if not d.is_dir():
        return []
    return sorted((f.stem, _read(f)) for f in d.glob("*.json"))


#: THE ENVIRONMENT THIS PROCESS READS AND WRITES. Pins and work live under their environment's name
#: in the record, and `current` is only a pointer; a process says which environment it is on
#: once (`use_track`) and every `get`/`put` of "pins" or "work" goes there. Nobody else
#: had to learn a new concept: `pins.py` and `work.py` still read "pins" and "work".
#: Before this, the current environment's data sat in top-level keys and a switch SWAPPED it
#: with a parked copy — which meant one current environment for the whole project, and two
#: sessions could not be on two environments. A record in the old shape is moved on first read.
TRACKED = ("pins", "work")
_TRACK: list = []

#: WHAT BELONGS TO AN ENVIRONMENT LIVES IN THE ENVIRONMENT'S FOLDER. Pins and work sat in
#: `record.json` under `tracks.<name>`, and to-dos sat in a parallel `todo/<name>/` tree, so
#: answering "what is on this environment" meant reading a 700KB JSON blob and a second
#: folder somewhere else. One folder per environment says it instead:
#:
#:      .journal/environments/<name>/pins.json
#:      .journal/environments/<name>/work.json
#:      .journal/environments/<name>/todo/NNN-*.md
#:
#: The record keeps the REGISTRY — which environments exist, who holds them, where sessions
#: are — because that is project-wide and is read on every event. What it no longer keeps is
#: their contents. Reading one small file per environment is also less work than parsing the
#: whole record for a list that only one environment needs.
ENVS = "environments"


def env_dir(root: Path, name: str) -> Path:
    return root / ENVS / (slug(name) or "default")


def _tracked_file(root: Path, name: str, key: str) -> Path:
    return env_dir(root, name) / f"{key}.json"


def use_track(name: str) -> None:
    _TRACK[:] = [name]


def slug(name: str) -> str:
    """An environment's name on disk and on the command line: lowercase, letters, digits, dashes.

    NO SPACES, EVER. A name with a space is a folder with a space, a flag that needs
    quoting, and a search that matches half of it. Everything becomes a slug on the way in.
    """
    return re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")[:60].rstrip("-")


def _record(root: Path) -> dict:
    data = _read(record_file(root))
    changed = False
    if any(k in data for k in TRACKED):
        cur = data.get("current") or "default"
        slot = data.setdefault("tracks", {}).setdefault(cur, {})
        for k in TRACKED:
            if k in data:
                slot[k] = data.pop(k)
        changed = True
    # OLDER NAMES WITH SPACES OR CAPITALS become slugs, once, here — the record, its
    # pointers, and the to-do folders that carry the name.
    held = data.get("tracks")
    if isinstance(held, dict) and any(slug(k) != k for k in held):
        fixed: dict = {}
        for k, v in held.items():
            s = slug(k) or "default"
            if s in fixed and isinstance(fixed[s], dict) and isinstance(v, dict):
                for key in ("pins", "work"):
                    fixed[s][key] = (fixed[s].get(key) or []) + (v.get(key) or [])
            else:
                fixed[s] = v
            _rename_todo_folder(root, k, s)
        data["tracks"] = fixed
        for key in ("current", "previous"):
            if data.get(key):
                data[key] = slug(data[key]) or "default"
        changed = True
    if changed:
        _write(record_file(root), data)
    return data


def _rename_todo_folder(root: Path, old: str, new: str) -> None:
    if old == new:
        return
    src, dst = root / "todo" / old, root / "todo" / new
    if src.is_dir() and not dst.exists():
        try:
            src.rename(dst)
        except OSError:
            pass


def _track_name(root: Path, data: dict) -> str:
    return _TRACK[0] if _TRACK else (data.get("current") or "default")


def get(root: Path, key: str, default=None, *, stem: str | None = None):
    if key in TRACKED:
        return tracked(root, key, _track_name(root, _record(root)), default)
    if is_record(key):
        return _read(record_file(root)).get(key, default)
    if not stem:
        return default
    return runtime(root, stem).get(key, default)


def put(root: Path, key: str, value, *, stem: str | None = None) -> None:
    """Write one key. A runtime write with no transcript SAYS SO and does nothing.

    Not an exception: the hook's contract is that a crash is worse than silence, and a
    handler fed a payload without a transcript should be quiet about the mark rather than
    dead. Not a silent fallback to project scope either — that is the bug this module was
    rewritten to end.
    """
    if key in TRACKED:
        put_tracked(root, key, _track_name(root, _record(root)), value)
        return
    if is_record(key):
        f = record_file(root)
    elif not stem:
        print(f"journal: no transcript to file {key!r} under — mark not written",
              file=sys.stderr)
        return
    else:
        f = runtime_file(root, stem)
    data = _read(f)
    data[key] = value
    _write(f, data)


def tracked(root: Path, key: str, track: str, default=None):
    """One TRACKED key, read off a named environment rather than the current one."""
    got = _read(_tracked_file(root, track, key)).get(key)
    if got is not None:
        return got
    # A RECORD THAT HAS NOT BEEN MIGRATED YET still answers. `migrate` moves these out on
    # the first run after an upgrade, and until it has, every read has to keep working —
    # a consumer that copies the package in by hand gets one CLI call before the move.
    held = _record(root).get("tracks")
    entry = held.get(slug(track)) if isinstance(held, dict) else None
    return entry.get(key, default) if isinstance(entry, dict) else default


def put_tracked(root: Path, key: str, track: str, value) -> None:
    """Write one TRACKED key on a NAMED environment.

    `get`/`put` resolve the environment from `current` or the `use_track` override, which is
    right for everything a session does to its own environment and wrong for the one
    operation that touches two: moving an entry from one to another. Swapping the override
    around a pair of writes would do it, and would leave the process pointed at the wrong
    environment if anything in between raised.
    """
    with locked(root):
        f = _tracked_file(root, track, key)
        f.parent.mkdir(parents=True, exist_ok=True)
        _write(f, {key: value})


def retire_old(root: Path) -> bool:
    """Set the project-wide runtime file aside, once. True if this call did it."""
    old = root / RETIRED
    if not old.is_file():
        return False
    try:
        old.rename(root / (RETIRED + ".retired"))
        return True
    except OSError:
        return False  # another process got there first; nothing to do


#: REENTRANT, by a depth counter. `tracks.switch` moves the record under the lock, and it
#: is written in terms of the same helpers a caller might already be holding the lock
#: through. A second `flock` on the same file in the same process blocks forever, verified;
#: a CLI that hangs until the tool timeout is worse than any lost pin.
_depth = 0
_held = None


@contextlib.contextmanager
def locked(root: Path, wait: float = 3.0):
    """Hold the record for one load-mutate-save.

    THE LOCK SPANS THE WHOLE OPERATION, not the write. A lock around `put` alone protects
    nothing: every caller loads, mutates, saves, and two of them interleaved both load eight
    pins and both write nine. The lock has to be taken before the load.

    BOUNDED. It waits a few seconds and then PROCEEDS with a line on stderr, because a hook
    has a timeout of its own and a wedged `journal remember` is a stalled tool with no
    message. A lost race under contention that long is a lost pin, which is visible in
    `pins`; a hang is not visible anywhere.
    """
    global _depth, _held
    if _depth:
        _depth += 1
        try:
            yield
        finally:
            _depth -= 1
        return
    try:
        import fcntl
    except ImportError:  # not POSIX: no lock, same behaviour as before this existed
        yield
        return
    root.mkdir(parents=True, exist_ok=True)
    fh = open(root / LOCK, "a+")
    deadline = time.monotonic() + wait
    got = False
    while True:
        try:
            fcntl.flock(fh, fcntl.LOCK_EX | fcntl.LOCK_NB)
            got = True
            break
        except OSError:
            if time.monotonic() >= deadline:
                print(f"journal: record locked for over {wait:.0f}s — proceeding without it",
                      file=sys.stderr)
                break
            time.sleep(0.02)
    _depth, _held = 1, fh
    try:
        yield
    finally:
        _depth, _held = 0, None
        if got:
            with contextlib.suppress(OSError):
                fcntl.flock(fh, fcntl.LOCK_UN)
        fh.close()
