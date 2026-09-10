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
import reminders as reminders_mod
import state
import todo as todo_mod
import tracks

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
    got = state.tracked(root, "pins", where, []) or []
    return got if isinstance(got, list) else []


def _claims(root: Path, key: str, where: str) -> list[dict]:
    out = []
    for i, p in enumerate(_standing(root, key, where), 1):
        if p.get("struck"):
            continue
        why = _dangling(root, p.get("fact", ""))
        if not why and p.get("body"):
            # THE SAME ROT, IN THE OTHER HALF. A dead path or a `journal <verb>` the CLI no
            # longer answers to rots in an argument exactly as it does in a claim, and the
            # argument is the half nobody re-reads.
            why = _dangling(root, pins_mod.body(root, i, key))
            if why:
                why += " (in its reasoning)"
        if not why:
            continue
        out.append({"kind": "rule" if key == pins_mod.RULES else "pin", "n": i, "where": where,
                    "text": p.get("fact", ""), "why": why, "age": pins_mod.age(p.get("at", "")),
                    "fix": (f'journal rules strike {i} "<why>"' if key == pins_mod.RULES
                            else f'journal pins strike {i} "<why>"')})
    return out


def _standing_reminders(root: Path, here: str) -> list[dict]:
    got = state.tracked(root, reminders_mod.KEY, here, []) or []
    return got if isinstance(got, list) else []


def _reminders(root: Path, here: str) -> list[dict]:
    """Reminders that name something gone — the same rot, in the store that repeats most.

    A REMINDER IS READ ALOUD MORE OFTEN THAN ANY CLAIM HERE: at the head of every stop
    chain and again every `reminder_every` tool calls, where a rule or a pin is handed over
    once a session. So a dead path, or a `journal <verb>` the CLI no longer answers to,
    costs more per day here than anywhere else — and this was the one store the checker did
    not look at.

    THE CONDITION IS NOT CHECKED, AND CANNOT BE. `--until` is prose by design — "the
    migration tests pass on CI" — so nothing here can say whether it came true. That is what
    the reading pass is for; this half checks only what is checkable.
    """
    out = []
    for i, r in enumerate(_standing_reminders(root, here), 1):
        if r.get("done"):
            continue
        why = _dangling(root, r.get("text", "")) or _dangling(root, r.get("until", ""))
        if not why:
            continue
        out.append({"kind": "reminder", "n": i, "where": here, "text": r.get("text", ""),
                    "why": why, "age": pins_mod.age(r.get("at", "")),
                    "fix": f'journal reminders done {i} "<why>"'})
    return out


def _docs(root: Path) -> list[dict]:
    out = []
    names = set(tracks._all(root))
    for d in docs_mod._load(root):
        if d.get("superseded_by"):
            continue
        why = ""
        gone = ""
        if d.get("track") and state.slug(d["track"]) not in {state.slug(n) for n in names}:
            gone = why = f"its environment `{d['track']}` is gone"
        elif d.get("status") == "draft" and not d.get("parts"):
            days = _days(d.get("at", ""))
            if days is not None and days >= DRAFT_DAYS:
                why = f"a draft with no parts, {int(days)}d old"
        if not why:
            continue
        # THE FIX MUST ANSWER THE FINDING. An orphaned doc is not a finished doc, and
        # offering `docs final` for it was the checker suggesting the one thing that does
        # not address what it just reported — the field is what is stale, not the status.
        out.append({"kind": "doc", "n": d["n"], "where": "", "text": d.get("title", ""),
                    "why": why, "age": pins_mod.age(d.get("at", "")),
                    "fix": (f"the doc still stands — edit `track:` in its index.md, or strike "
                            f'what no longer holds: journal docs strike {d["n"]}.<p> "<why>"'
                            if gone else
                            f'journal docs final {d["n"]}   (or `docs strike {d["n"]}.<p> "<why>"`)')})
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
        if [p for p in (state.tracked(root, "pins", name, []) or []) if not p.get("struck")]:
            continue
        if [w for w in (state.tracked(root, "work", name, []) or []) if not w.get("ended")]:
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
    found += _reminders(root, here)
    return found + _docs(root) + _todos(root, here) + _environments(root, here, stale_hours)


def report(root: Path, here: str, every: bool = False, stale_hours: float = 24.0) -> str:
    import fmt
    found = candidates(root, here, every, stale_hours)
    out = [fmt.title("CLEANUP", sub=("every environment" if every else here)), ""]
    if not found:
        out.append(fmt.wrap("Nothing here has evidence against it: every rule, pin and reminder "
                            "names something that still exists, no doc is orphaned, no to-do has "
                            "been waiting on the user, and no environment is empty."))
        out.append("")
    for kind in ("rule", "pin", "reminder", "doc", "to-do", "environment"):
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
    # THE SECOND HALF IS NOT PRINTED HERE, and that is the point of splitting them. What a
    # check can see fits in a list; what only reading can see is every rule and every pin,
    # one at a time, against the code they claim things about — and a wall of them appended
    # to a findings list is a wall that gets skimmed. `cleanup read` is a separate act,
    # taken deliberately, and the record remembers when it was last taken.
    out.append(fmt.dim("  THE SECOND HALF — what no check can see"))
    out.append(fmt.wrap("A rule that quietly stopped describing how anyone works names no file "
                        "and misspells no command: it passes every check above and always will. "
                        "Only reading finds it. `journal cleanup read` puts every rule and every "
                        "pin in front of you with the questions to ask of each — "
                        + last_read(root, here) + "."))
    if not every:
        out.append("")
        out.append(fmt.dim("  journal cleanup --all   the pins of every environment, not just this one"))
    return "\n".join(out)


READ = "cleanup_read"      # {environment: {"at": iso, "rules": n, "pins": n}}


def _read_log(root: Path) -> dict:
    got = state.get(root, READ, {})
    return got if isinstance(got, dict) else {}


#: HOW OFTEN A READING PASS IS OWED. Not a deadline and not an expiry — nothing here
#: expires — just the interval after which the hook is allowed to mention that nobody has
#: read the claims lately. Three weeks is roughly a working stretch of this project.
READ_DAYS = 21


def days_since_read(root: Path, here: str) -> float | None:
    """Days since this environment's claims were last read, or None if they never were."""
    got = _read_log(root).get(here) or {}
    return _days(got.get("at", "")) if got.get("at") else None


def last_read(root: Path, here: str) -> str:
    """When this environment's claims were last READ, in words — never is a real answer.

    AND "NEVER" SAYS WHETHER IT IS OWED, because on its own it reads as a bug. A field
    report worked back from this line to the conclusion that the reading-pass nudge was
    broken: the record said the pass had never been done, the nudge never fired, and
    nothing on the page connected the two. `owed` is the gate and it is deliberate — every
    record starts never-read, and a store that nags from its first pin teaches its reader
    to ignore the line before there is anything worth reading. The condition was right and
    only the sentence was silent about it, which is the same defect one level up: a fact
    stated without the qualification that makes it mean anything.
    """
    got = _read_log(root).get(here) or {}
    days = _days(got.get("at", "")) if got.get("at") else None
    if days is None:
        return ("never done on this environment" if owed(root, here) else
                f"never done here, and not owed yet — nothing standing is {READ_DAYS} days old")
    if days < 1:
        return "last done today"
    return f"last done {int(days)}d ago"


def owed(root: Path, here: str) -> bool:
    """Is a reading pass actually owed here — or is this simply a young record?

    NEVER-READ IS NOT THE SAME AS OVERDUE. Every record starts never-read, and a store that
    says so from its first pin is a store that has taught its reader to ignore the line
    before there is anything worth reading. A pass is owed when there is something to read
    AND it has had time to rot: the oldest standing claim is at least READ_DAYS old, or a
    pass was done and that long ago.
    """
    since = days_since_read(root, here)
    if since is not None:
        return since >= READ_DAYS
    ages = [_days(c.get("at", "")) or 0.0
            for c in (_standing(root, pins_mod.RULES, "") + _standing(root, pins_mod.KEY, here))
            if not c.get("struck")]
    return bool(ages) and max(ages) >= READ_DAYS


def stamp(root: Path, here: str, at: str, rules: int, pins: int) -> None:
    with state.locked(root):
        log = _read_log(root)
        log[here] = {"at": at, "rules": rules, "pins": pins}
        state.put(root, READ, log)


#: THE QUESTIONS, in the order they cost least to answer. The first is answerable from the
#: claim alone; the second needs a grep; the third needs the reader to have worked here.
#: They are printed rather than assumed because "read the pins" is not an instruction
#: anyone can follow twice the same way, and the answers are what a strike reason says.
QUESTIONS = (
    "Is this still what the project does — or does it describe a version of the code that is gone?",
    "Does the thing it asserts still hold? Grep for it before you decide; a claim about a "
    "module is checkable in one command.",
    "Would a reader handed this cold, at the top of a session, be MISLED by it? A claim that "
    "is merely incomplete is fine. One that points the wrong way is not.",
)


def _entry(n: int, item: dict, noun: str) -> str:
    """One claim, WHOLE. Nothing is truncated in the reading pass: a claim cut at 70
    characters is a claim judged on its opening, which is how a rule survives every pass.

    THE LONG FORM IS NAMED, NOT PRINTED, and that is a deliberate deviation from the line
    above — do not "fix" it. Printing 125 claims is the point; printing 125 claims AND 125
    arguments is a wall nobody reads, which is the same failure as truncating, arrived at
    from the other side. The claim is what is being judged; the argument is one command away
    for the entries where the judgement is hard.
    """
    import fmt
    body = fmt.wrap(item.get("fact", ""), indent=7)
    # THE NOUN IS ALREADY PLURAL, and for a while this line did not believe it. Both callers
    # pass "rules" or "pins" — the CLI's own spellings — so `noun == "rule"` was never true
    # and every claim, rule or pin, was offered `journal pins show <n>`. For a rule that is
    # a different claim, in a different store, under the same number: the reading pass sent
    # the reader to the wrong text at the one moment its whole design says they must read
    # the claim before judging it.
    extra = f" · journal {noun} show {n}" if item.get("body") else ""
    return (f"  {n:>3}" + body[5:] + "\n"
            + fmt.dim(f"       {pins_mod.age(item.get('at', ''))} · "
                      f'journal {noun} strike {n} "<why>"' + extra))


def reading(root: Path, here: str, at: str = "", mark: bool = True) -> str:
    """Every rule and every pin, in full, to be judged by somebody who has read the code.

    THE COMMAND CANNOT DO THIS AND DOES NOT PRETEND TO. Everything in `report` is a fact
    about the world the claim points at — a file, a spelling, a folder. Nothing there is a
    fact about what the claim MEANS, and the rot that matters most is entirely semantic:
    the rule that was true when the code worked one way and was never revisited when it
    stopped. So this half is a reading list, printed in full because a pointer to
    `journal rules` is how it gets skipped, and stamped because "when did anyone last
    actually read these" is the one thing the record can answer and a reader cannot.

    THE STAMP IS NOT A CERTIFICATE. It records that the claims were put in front of a
    reader, which is all a CLI can witness. It is there so the next session can be told
    "never done on this environment" instead of nothing at all.
    """
    import fmt
    rules = [(i, r) for i, r in enumerate(_standing(root, pins_mod.RULES, ""), 1)
             if not r.get("struck")]
    pins = [(i, p) for i, p in enumerate(_standing(root, pins_mod.KEY, here), 1)
            if not p.get("struck")]
    out = [fmt.title("CLEANUP: THE READING PASS", sub=here), ""]
    out.append(fmt.wrap("Read every claim below against the code you have just been working in, "
                        "and ask of each:"))
    out.append("")
    for i, q in enumerate(QUESTIONS, 1):
        out.append(fmt.wrap(f"{i}. {q}", indent=5))
    out.append("")
    out.append(fmt.wrap("Strike what you have read and judged dead — the reason is the answer you "
                        "just gave, and a strike hides the claim rather than erasing it, so being "
                        "wrong is cheap. Leave what still holds; leaving is the common answer and "
                        "it costs nothing. If a claim is right but out of date, `pins add "
                        '"<the claim now>" --supersedes=<n>` replaces it in one move.'))
    out.append("")
    out.append(fmt.dim(f"  RULES — {len(rules)}, binding every environment"))
    for i, r in rules:
        out.append(_entry(i, r, "rules"))
    out.append("")
    out.append(fmt.dim(f"  PINS — {len(pins)}, standing on `{here}`"))
    for i, p in pins:
        out.append(_entry(i, p, "pins"))
    out.append("")
    # THE ONE STORE WHOSE CONDITION ONLY A READER CAN JUDGE. `--until` is prose on purpose,
    # so no check will ever retire a reminder whose moment has passed — and it is injected
    # more often than anything else here. Omitted from the reading pass, nothing in the
    # system ever asks whether it is still worth saying.
    said = [(i, r) for i, r in enumerate(_standing_reminders(root, here), 1) if not r.get("done")]
    if said:
        out.append(fmt.dim(f"  REMINDERS — {len(said)}, repeated at every stop on `{here}`"))
        for i, r in said:
            body = fmt.wrap(r.get("text", ""), indent=7)
            out.append(f"  {i:>3}" + body[5:] + "\n"
                       + fmt.dim(f"       {pins_mod.age(r.get('at', ''))}"
                                 + (f" · until: {r['until']}" if r.get("until") else "")
                                 + f' · journal reminders done {i} "<why>"'))
        out.append("")
    out.append(fmt.wrap(f"That is {len(rules)} rule(s), {len(pins)} pin(s) and {len(said)} "
                        "reminder(s) — the whole of what "
                        "every later session is handed as true. When you have been through them, "
                        "say what you struck and what you left; the record keeps when this was "
                        "last done, not what was decided."))
    if mark and at:
        stamp(root, here, at, len(rules), len(pins))
    return "\n".join(out)
