"""The journal, read for a page rather than a terminal: plain, JSON-safe data.

EVERYTHING ELSE HERE ANSWERS TO A TERMINAL. `fmt.render` bolds when stdout is a tty,
`fmt.room` measures a terminal's width, `docs.show` and `todo.show` build strings meant
to be printed once and read top to bottom. A web page is neither: it has no width to
measure, needs no ANSI, and wants structured fields it can lay out itself — a title here,
a badge there — not a paragraph with the badge already baked into the text.

So this module answers the same questions those already do — what to-dos are open on an
environment, what a doc says, what stands pinned — through the SAME read functions
(`pins.listing`, `todo.all_items`, `docs.all_docs`, …), and returns plain dicts and lists
of strings, ints and bools. No `pathlib.Path`, no terminal formatting. Nothing here reads
a file or a JSON store directly; that would be the parsing this module exists to avoid
duplicating.

TRACK-AWARE, ON PURPOSE. Every read a terminal command makes is about the environment the
PROCESS is on — one at a time, because a session is on one environment. A page showing
"web-interface" while another tab shows "reminders" has no such process to be on, so every
function here takes the environment as an explicit argument and reads it through
`state.tracked` (via `entries.all_of`, `pins._all`, `reminders._all`, `work._all`), never
through `state.use_track`. Nothing in this module is a global switch.
"""
from __future__ import annotations

import re
from pathlib import Path

import docs as docs_mod
import fmt
import inbox
import pins
import questions
import reminders
import todo
import tools
import tracks
import work


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


# ────────────────────────────────────────────────────────────── environments
def environments(root: Path) -> list[dict]:
    """Every environment: its name, whether it is the project's current one, whether
    a live agent session is actually working it right now, and counts.

    "current" and "active" answer DIFFERENT questions. Current is the project's
    default — where a fresh session lands — a pointer that sits still until someone
    switches it. Active is a HEARTBEAT: `tracks.live` counts a session as running
    only if a hook event touched it within the last `stale_hours` (default 24) —
    the same signal `journal environments` already prints as "active just now" /
    "idle 2.0 h" per session. An environment can be current with nobody on it, or
    active on an environment that was never the default.
    """
    current = tracks.current(root)
    active = {info["track"] for info in tracks.live(root).values()}
    out = []
    for name in tracks._all(root):
        out.append({
            "name": name,
            "current": name == current,
            "active": name in active,
            "todos": len(todo.open_items(root, name)),
            "pins": len(pins.live(root, track=name)),
            "work": len(work.open_work(root, track=name)),
            "reminders": len(reminders.live(root, track=name)),
            "docs": len(docs_on(root, name)),
            "inbox": len(inbox.unprocessed(root, name)),
            "questions": len(questions.open_items(root, name)),
        })
    out.sort(key=lambda e: (not e["current"], e["name"]))
    return out


def overview(root: Path) -> dict:
    """Everything a landing page needs: the environments, plus project-wide counts."""
    envs = environments(root)
    return {
        "environments": envs,
        "rules": len(pins.live(root, pins.RULES)),
        "docs": len(docs(root)),
        "project": root.resolve().parent.name,
    }


# ────────────────────────────────────────────────────────────────── docs
def docs(root: Path) -> list[dict]:
    """The project's OWN docs — global scope, never one environment's. `docs.row`
    is the same shape `docs.catalogue`'s own `facts()` is built from.

    The web viewer splits the catalogue the way `docs.scope_of` already
    distinguishes it: this is what the top nav's docs page shows; `docs_on`
    is the environment-scoped half, on that environment's own page.
    """
    return [docs_mod.row(root, d) for d in docs_mod.all_docs(root)
           if docs_mod.scope_of(d) == docs_mod.GLOBAL]


def docs_on(root: Path, env: str) -> list[dict]:
    """The docs scoped to this ONE environment — never the project's global ones."""
    return [docs_mod.row(root, d) for d in docs_mod.all_docs(root)
           if docs_mod.scope_of(d) == env]


# ────────────────────────────────────────────────────────────────── pins & rules
#: WHERE IN THE TRANSCRIPT A PIN WAS WRITTEN IS FOR `pins around`, not for a reader of
#: the web viewer — it names nothing they can act on. Every pin/rule's meta carries
#: it (or its fallback, "before lines were kept") as one whole segment between the
#: " · " separators `entries.rows` joins with, so it is dropped as a whole segment
#: rather than pattern-matched out of running prose.
_LINE_SEGMENT = re.compile(r"^line \d+$|^before lines were kept$")


def _drop_line_segment(meta: str) -> str:
    return " · ".join(p for p in meta.split(" · ") if not _LINE_SEGMENT.match(p))


#: A FACT IS PRIMARY IF A READER ACTS ON IT WITHOUT DIGGING: how long it has stood, a
#: condition it is waiting on, what it cites. Everything else a CLI meta string carries
#: — a strike reason, "has its reasoning (pins show N)" — is real but secondary: worth
#: keeping, not worth the same weight on the row. `journal <noun>` still shows all of it
#: as one line; this is a WEB-ONLY split of the same response, into what a page shows
#: plainly and what it tucks behind a disclosure (see to-do 15).
def _is_primary_fact(segment: str) -> bool:
    return (segment.endswith(" ago") or segment == "just now"
           or segment.startswith("→ ") or segment.startswith("until:"))


def _split_segments(meta: str) -> list[str]:
    """Split on ' · ' — except a '→ doc ...' citation can carry one itself, between
    a doc's title and a part's (`docs.ref_label`), and always comes last in the
    string (see `pins._store`'s `facts`). So once a segment opens a citation, every
    segment after it is that citation continuing, never a new fact of its own."""
    raw = meta.split(" · ") if meta else []
    out: list[str] = []
    for s in raw:
        if out and out[-1].startswith("→ ") and not s.startswith("→ "):
            out[-1] = out[-1] + " · " + s
        else:
            out.append(s)
    return out


def _split_meta(row: dict) -> dict:
    segments = _split_segments(_drop_line_segment(row["meta"]))
    primary = [s for s in segments if _is_primary_fact(s)]
    secondary = [s for s in segments if not _is_primary_fact(s)]
    return {**row, "meta": " · ".join(primary), "meta_secondary": secondary}


# ────────────────────────────────────────────────────────────────── work & reminders
# ────────────────────────────────────────────────────────────────── inbox & questions
def questions_on(root: Path, env: str) -> list[dict]:
    return questions.rows_response(root, env)


def question_detail(root: Path, env: str, n: int) -> dict | None:
    items = questions._all(root, env)
    if n < 1 or n > len(items):
        return None
    return questions.row_response(n, items[n - 1])


def questions_about(root: Path, env: str, ref: str) -> list[dict]:
    return [questions.row_response(n, q) for n, q in questions.about(root, ref, env)]


def questions_everywhere(root: Path, matches) -> list[dict]:
    out = []
    for name in tracks._all(root):
        for n, q in enumerate(questions._all(root, name), 1):
            if not q.get("withdrawn") and any(matches(r) for r in q.get("links") or []):
                out.append({**questions.row_response(n, q), "env": name})
    return out


# ────────────────────────────────────────────────────────────────── tools


# ────────────────────────────────────────────────────────────────── safety
def safe_path(root: Path, project: Path, requested: str) -> Path | None:
    """A requested path, resolved and refused unless it stays under `root` or `project`.

    EVERY ATTACHMENT LINK THIS MODULE HANDS OUT IS ALREADY AN ABSOLUTE PATH under one of
    those two trees — `docs.attachments` resolves them, not a URL. This is the check a
    server puts BETWEEN an incoming, untrusted URL and the filesystem before it ever
    turns that URL back into a path: reject `..` traversal and any absolute path that
    does not resolve inside `root` or `project`, silently, by returning None rather than
    raising — a byte off a URL earns a 404, never a traceback.
    """
    if not requested:
        return None
    try:
        candidate = Path(requested)
        candidate = candidate if candidate.is_absolute() else (root / requested)
        candidate = candidate.resolve()
        root_r, project_r = root.resolve(), project.resolve()
    except (OSError, ValueError):
        return None
    under_root = candidate == root_r or root_r in candidate.parents
    under_project = candidate == project_r or project_r in candidate.parents
    if not (under_root or under_project):
        return None
    return candidate
