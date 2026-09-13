from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import fmt
import transcript
import worktree

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
