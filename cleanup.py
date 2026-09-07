"""cleanup — what in the record has stopped being true, laid out to be judged.

WHY THIS IS A COMMAND AND NOT AN INSTRUCTION. Rules and pins are the only things handed
whole to every session, in the highest-authority position the system has, and nothing
revisits them: `pins.age` says so in its own docstring and then shows an age instead of
expiring anything. That is right — automatic eviction is the failure this store exists to
prevent — but "nothing revisits them" was being answered by the USER, by hand, pasting
the same paragraph into session after session: remove the obsolete rules, clear the docs
nobody uses, strike the stale pins. A thing the user has to say every time is a thing the
tool has not learned.

SO THE JUDGEMENT STAYS, AND ONLY THE LOOKING IS AUTOMATED. Nothing here strikes anything.
It gathers what an agent would otherwise have to read four stores to notice — a rule that
names a file which is not there, a pin that names a command that does not exist, a draft
doc nobody has touched in a fortnight, an environment with nothing on it — and prints each
one beside the exact command that retires it. The evidence is in the line, so the reader
can disagree with it.

WHAT COUNTS AS EVIDENCE. Age alone never does: a fact three months old that still holds is
the best kind of pin, and a list that flags it teaches the reader to skim. Every candidate
here rests on something checkable — a path that is gone, a spelling the CLI does not
answer, a draft with no part in it, an environment with no pins, no work and no to-dos —
and the age is shown beside it as context, never as the reason.
"""
from __future__ import annotations

import re
from pathlib import Path

import docs as docs_mod
import help as help_mod
import pins as pins_mod
import state
import todo as todo_mod
import tracks
import work as work_mod

#: A path inside a claim: `hook.py:342`, `.journal/todo/`, `src/a/b.ts`. The suffix list is
#: what this project's claims actually cite; anything without one is prose, not a path.
PATH = re.compile(r"[\w./-]*\w(?:\.(?:py|md|json|sh|ts|tsx|js|jsx|toml|yaml|yml|txt|html|css))\b")
#: `journal <verb>` in any of its spellings — the CLI's own name, then the word after it.
#: ONLY INSIDE BACKTICKS, which is what tells a command apart from a sentence. The repo is
#: named after the CLI and the CLI is named after the noun, so "every journal command" and
#: "agent-journal from now on" both read as `journal <verb>` to a bare regex — and a checker
#: that cries wolf on prose is one whose next real finding is skimmed past.
CMD = re.compile(r"`(?:\.journal/)?journal(?:\.py)?\s+([a-z-]{2,})")

DRAFT_DAYS = 14      # a draft nobody has added a part to in this long is asked about
ASKED_DAYS = 7       # a to-do waiting on the user this long is worth repeating


def _verbs() -> set[str]:
    """Every first word the CLI answers to — the one list the help is generated from."""
    return set(help_mod.GROUPS) | set(help_mod.ALIAS) | {"journal", "help"}


def _days(at: str) -> float | None:
    from datetime import datetime, timezone
    try:
        when = datetime.fromisoformat((at or "").replace("Z", "+00:00"))
    except ValueError:
        return None
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - when).total_seconds() / 86400


def _dangling(root: Path, text: str) -> str:
    """What this claim names that is not there any more — or "" if it all checks out.

    THE PATH IS CHECKED FROM THE PROJECT, NOT FROM `.journal/`, because a claim cites a
    file the way the reader would type it. A bare name with no slash is ambiguous — `fmt.py`
    could be anywhere — so it counts as gone only when nothing of that name exists anywhere
    under the project, which is the case that actually happens: the file was deleted.
    """
    project = root.parent
    for raw in PATH.findall(text):
        p = raw.split(":")[0].lstrip("`").rstrip("`,.")   # a LEADING dot is part of `.journal/x`, not punctuation
        if not p or p.startswith(("http", "www.")):
            continue
        # A FILE THE JOURNAL GENERATES IS NOT A FILE THAT DIED. `.journal/` is a working
        # store — a hand-off page, an archive, a runtime file — written when something
        # happens and absent the rest of the time, so its absence proves nothing about the
        # claim that names it. The package's own sources live there too when installed,
        # and those are found under the checkout anyway.
        if p.startswith(".journal/") and not (root / p.split("/", 1)[1]).exists():
            continue
        if "/" in p:
            if (project / p.lstrip("/")).exists() or (root / p).exists():
                continue
            if any(project.rglob(Path(p).name)):
                continue   # moved, not gone: the claim's path is stale, the file is not
            return f"names {p}, which is not in the project"
        if not any(project.rglob(p)):
            return f"names {p}, which is not in the project"
    for verb in CMD.findall(text):
        if verb not in _verbs():
            return f"names `journal {verb}`, which the CLI does not answer to"
    return ""


def _standing(root: Path, key: str, where: str) -> list[dict]:
    """Every entry of one store, unfiltered — rules from the record, pins from their OWN
    environment rather than from whichever one this process happens to be reading."""
    if key == pins_mod.RULES:
        got = state.get(root, key, [])
        return got if isinstance(got, list) else []
    got = (tracks._all(root).get(where) or {}).get("pins", [])
    return got if isinstance(got, list) else []


def _claims(root: Path, key: str, where: str) -> list[dict]:
    out = []
    for i, p in enumerate(_standing(root, key, where), 1):
        if p.get("struck"):
            continue
        why = _dangling(root, p.get("fact", ""))
        if not why:
            continue
        out.append({"kind": "rule" if key == pins_mod.RULES else "pin", "n": i, "where": where,
                    "text": p.get("fact", ""), "why": why, "age": pins_mod.age(p.get("at", "")),
                    "fix": (f'journal rules strike {i} "<why>"' if key == pins_mod.RULES
                            else f'journal pins strike {i} "<why>"')})
    return out


def _docs(root: Path) -> list[dict]:
    out = []
    names = set(tracks._all(root))
    for d in docs_mod._load(root):
        if d.get("superseded_by"):
            continue
        why = ""
        if d.get("track") and state.slug(d["track"]) not in {state.slug(n) for n in names}:
            why = f"its environment `{d['track']}` is gone"
        elif d.get("status") == "draft" and not d.get("parts"):
            days = _days(d.get("at", ""))
            if days is not None and days >= DRAFT_DAYS:
                why = f"a draft with no parts, {int(days)}d old"
        if not why:
            continue
        out.append({"kind": "doc", "n": d["n"], "where": "", "text": d.get("title", ""),
                    "why": why, "age": pins_mod.age(d.get("at", "")),
                    "fix": f'journal docs final {d["n"]}   (or `docs strike {d["n"]}.<p> "<why>"`)'})
    return out


def _todos(root: Path, here: str) -> list[dict]:
    out = []
    for t in todo_mod.asking(root, here):
        days = _days(t.get("at", ""))
        if days is None or days < ASKED_DAYS:
            continue
        out.append({"kind": "to-do", "n": t["n"], "where": here, "text": t.get("title", ""),
                    "why": f"waiting on the user for {int(days)}d", "age": "",
                    "fix": f'journal todos done {t["n"]} "<how>"   (or ask again)'})
    return out


def _environments(root: Path, here: str, stale_hours: float = 24.0) -> list[dict]:
    out = []
    start = state.get(root, tracks.CURRENT, tracks.DEFAULT) or tracks.DEFAULT
    alive = {v["track"] for v in tracks.live(root, stale_hours).values()}
    for name, held in tracks._all(root).items():
        if name in (start, here) or name in alive:
            continue
        if [p for p in held.get("pins", []) if not p.get("struck")]:
            continue
        if [w for w in held.get("work", []) if not w.get("ended")]:
            continue
        if todo_mod.open_items(root, name):
            continue
        out.append({"kind": "environment", "n": 0, "where": "", "text": name,
                    "why": "no pins, no open work, no to-dos, nobody on it", "age": "",
                    "fix": f'journal environments remove "{name}" --yes'})
    return out


def candidates(root: Path, here: str, every: bool = False, stale_hours: float = 24.0) -> list[dict]:
    """Everything the record holds that has evidence against it, in reading order."""
    found = _claims(root, pins_mod.RULES, "every environment")
    if every:
        for name in sorted(tracks._all(root)):
            found += _claims(root, pins_mod.KEY, name)
    else:
        found += _claims(root, pins_mod.KEY, here)
    return found + _docs(root) + _todos(root, here) + _environments(root, here, stale_hours)


def report(root: Path, here: str, every: bool = False, stale_hours: float = 24.0) -> str:
    import fmt
    found = candidates(root, here, every, stale_hours)
    out = [fmt.title("CLEANUP", sub=("every environment" if every else here)), ""]
    if not found:
        out.append(fmt.wrap("Nothing here has evidence against it: every rule and pin names "
                            "something that still exists, no doc is orphaned, no to-do has been "
                            "waiting on the user, and no environment is empty."))
        out.append("")
    for kind in ("rule", "pin", "doc", "to-do", "environment"):
        rows = [f for f in found if f["kind"] == kind]
        if not rows:
            continue
        out.append(fmt.dim(f"  {kind.upper()}S"))
        for f in rows:
            head = f"{f['n']}" if f["n"] else ""
            out.append(f"  {head:>3}  {f['text'][:70]}")
            out.append(f"       {f['why']}" + (f" · {f['age']}" if f["age"] else "")
                       + (f" · on {f['where']}" if f["where"] and kind == "pin" else ""))
            out.append(fmt.dim(f"       {f['fix']}"))
        out.append("")
    if found:
        out.append(fmt.wrap("Each line is a CANDIDATE, not a verdict: the evidence is printed so you "
                            "can disagree with it. A strike hides a claim and never erases it — "
                            "the text and the reason stay under `journal rules --all` and `journal "
                            "pins --all` — so striking a claim you have read and judged dead is "
                            "cheap, and leaving one that still holds costs nothing but the line."))
    out.append("")
    # WHAT NO CHECK CAN SEE is the whole reason this ends with a reading list rather than a
    # verdict. The claim that sent this command into being — a rule about subagents that had
    # stopped describing how anyone works — names no file, misspells no command, and would
    # pass every test above forever. Evidence finds the DEAD references; only a reader finds
    # the dead claims. So the rules are printed in full, every time: there are few of them,
    # they bind every environment, and the ones that rot are the ones nobody re-reads.
    out.append(fmt.dim("  RULES IN FORCE — no check can tell a rule that stopped being how anyone works"))
    standing = [(i, r) for i, r in enumerate(_standing(root, pins_mod.RULES, ""), 1)
                if not r.get("struck")]
    for i, r in standing:
        out.append(f"  {i:>3}  {r.get('fact', '')[:70]}")
        out.append(fmt.dim(f"       {pins_mod.age(r.get('at', ''))} · "
                           f'journal rules strike {i} "<why>"'))
    mine = len([p for p in _standing(root, pins_mod.KEY, here) if not p.get("struck")])
    out.append("")
    out.append(fmt.wrap(f"Then the {mine} pin(s) standing on `{here}`: `journal pins` lists them, "
                        '`journal pins strike <n> "<why>"` retires one. Read them as a reader '
                        "handed them cold at the top of a session would — a claim that no longer "
                        "describes how anyone works costs more than a gap, because nobody "
                        "questions it."))
    if not every:
        out.append("")
        out.append(fmt.dim("  journal cleanup --all   the pins of every environment, not just this one"))
    return "\n".join(out)
