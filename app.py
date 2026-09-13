from __future__ import annotations

import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import fmt
import transcript
import worktree
from templates import render

BRIEF_WAIT = 10.0
BRIEF_REFUSED = ("--brief takes the brief on stdin and nothing arrived. Pipe it in — "
                 "journal <command> --brief <<'MSG' … MSG — or drop --brief and pass the "
                 "title alone.")

MESSAGES = {
    "guessed": "  (guessed: newest transcript, {name} — {env} is not set)",
    "stdin_open": "journal: stdin never closed — took the {n} character(s) that arrived in {seconds}s",
    "doc_refused": "--doc: {why}",
}

_PACKAGE = Path(__file__).resolve().parent
ROOT, WORKTREE_NOTE = _PACKAGE, ""


def start(entry: Path) -> None:
    # resolved from the script that was run: sys.path holds the resolved package, so this
    # module's own path can never tell a worktree's symlinked .journal from the main one
    global _PACKAGE, ROOT, WORKTREE_NOTE
    _PACKAGE = entry.parent if entry.parent.is_symlink() else entry.resolve().parent
    ROOT, WORKTREE_NOTE = worktree.resolve(_PACKAGE)

#: catalogue pages (docs, tools, todos, pins, rules) are shorter than a search's 25 (ruling R7)
CATALOGUE_PAGE = 15


def root() -> Path:
    return ROOT


def project() -> Path:
    return _PACKAGE.parent


def stem() -> str | None:
    got = transcript.session_transcript(project())
    return got[0].stem if got and not got[1] else None


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def refuse(why: str) -> int:
    fmt.say(why, error=True)
    return 1


def answer(result: tuple[bool, str]) -> int:
    ok, msg = result
    fmt.say(msg, error=not ok)
    return 0 if ok else 1


def brief(flag: bool) -> str | None:
    # bounded: an agent's shell hands the command a stdin nobody closes, so read() would hang
    if not flag:
        return ""
    if sys.stdin is None or sys.stdin.closed or sys.stdin.isatty():
        return None
    try:
        import select
        import time
        fd = sys.stdin.fileno()
    except (ImportError, OSError, ValueError):
        return sys.stdin.read() or None
    chunks: list[bytes] = []
    deadline = time.monotonic() + BRIEF_WAIT
    while True:
        left = deadline - time.monotonic()
        if left <= 0:
            if not b"".join(chunks).strip():
                return None
            print(render(MESSAGES["stdin_open"], n=len(b"".join(chunks)), seconds=f"{BRIEF_WAIT:.0f}"),
                  file=sys.stderr)
            break
        if not select.select([fd], [], [], min(left, 0.1))[0]:
            continue
        blob = os.read(fd, 65536)
        if not blob:
            break
        chunks.append(blob)
    text = b"".join(chunks).decode("utf-8", "replace")
    return text if text.strip() else None


def resolved() -> tuple[Path, bool] | None:
    got = transcript.session_transcript(project())
    if got and got[1]:
        fmt.say(render(MESSAGES["guessed"], name=got[0].name, env=transcript.SESSION_ENV), error=True)
    return got


def where() -> dict:
    got = resolved()
    if got is None:
        return {}
    path, guessed = got
    lines, _ = transcript.read(path)
    out = {"line": lines[-1].n if lines else 0, "session": path.name}
    if guessed:
        out["guessed"] = True
    return out


def doc_where(doc_ref: str) -> dict | None:
    out = where()
    if doc_ref:
        import docs
        err = docs.check_ref(root(), doc_ref)
        if err:
            fmt.say(render(MESSAGES["doc_refused"], why=err), error=True)
            return None
        base, head, _ = docs.anchor(root(), doc_ref)
        doc, prt, _ = docs.get(root(), base)
        doc_ref = f"{doc['n']}.{prt['p']}" if prt else str(doc["n"])
        if head:
            doc_ref += "#" + docs.slug_of(head)
        out["doc"] = doc_ref
    return out


def catalogue(title: str, sub: str, listed, empty: str, lead: str, rows,
              noun: str = "", page: int = 1, order: str = fmt.DESC) -> int:
    items, left = listed
    fmt.say(fmt.Out(title=title, sub=sub,
                    items=(tuple(items) or (fmt.Item(text=empty),))
                          + ((fmt.Item(text=fmt.more(noun, left, page, order).strip()),)
                             if left else ())
                          + (fmt.Item(text=lead),)
                          + tuple(fmt.Item(title=c, text=w) for c, w in rows)))
    return 0
