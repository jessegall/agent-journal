"""Delayed work — what the agent should remember TO DO. Not a rule, not a pin, not in flight.

A pin is a claim, a rule binds, open work is in flight. None of them holds "do this later",
and a piece of work that is only remembered in a summary is a piece of work that is
forgotten at the next compaction. So a to-do is written down, and it is written as a FILE:
a to-do is a brief, not a claim, and when it is picked up in a week the reader needs what,
why and where to start, which is longer than one line. A file can be edited by hand and
read in a diff.

SCOPED TO THE ENVIRONMENT. A to-do belongs to the line of work that deferred it, and one environment's
debts do not bleed into another's: `todo/<environment>/NNN-<slug>.md`. The number is the file's,
stable for the life of the to-do, so "to-do 3" means the same thing after 2 is done.

SAID, NEVER HELD, AND NOT AT EVERY STOP. An idle agent told "three to-dos are waiting"
will start one; whether it should is the user's call. The line says so, and it is said once
per transcript and again only when the list has changed — a reminder at every idle stop is
wallpaper within the hour.
"""
from __future__ import annotations

import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import fmt
import state

DIR = "todo"
STRUCK = "struck"
FIELDS = ("title", "track", "at", "session", "line", "started", "done", "how", "asks", "answer",
          "doc", "reopened")


def _slug(text: str, limit: int = 40) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return (s[:limit].rstrip("-") or "untitled")


def folder(root: Path, track: str) -> Path:
    track = state.slug(track) or "default"
    return root / DIR / _slug(track, 60)


def _parse(path: Path) -> dict:
    text = path.read_text()
    meta: dict = {"title": "", "body": "", "path": path}
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            for line in text[4:end].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
            text = text[end + 4:].lstrip("\n")
    meta["body"] = text.strip()
    m = re.match(r"(\d+)-", path.name)
    meta["n"] = int(m.group(1)) if m else 0
    if not meta["title"]:
        meta["title"] = path.stem
    return meta


def _write(path: Path, meta: dict, body: str) -> None:
    lines = ["---"] + [f"{k}: {meta.get(k, '') or ''}" for k in FIELDS] + ["---", ""]
    if body.strip():
        lines += [body.strip(), ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines))


def _all(root: Path, track: str) -> list[dict]:
    d = folder(root, track)
    if not d.is_dir():
        return []
    return sorted((_parse(f) for f in d.glob("*.md")), key=lambda m: m["n"])


def open_items(root: Path, track: str) -> list[dict]:
    return [t for t in _all(root, track) if not t.get("done")]


def ready(root: Path, track: str) -> list[dict]:
    """Open to-dos that are NOT waiting on the user: what auto may pick up. Answered first."""
    items = [t for t in open_items(root, track) if not t.get("asks") or t.get("answer")]
    return sorted(items, key=lambda t: 0 if answered_one(t) else 1)


def asking(root: Path, track: str) -> list[dict]:
    """Open to-dos waiting on the user, each with its question, not yet answered."""
    return [t for t in open_items(root, track) if t.get("asks") and not t.get("answer")]


def answered_one(t: dict) -> bool:
    return bool(t.get("asks") and t.get("answer") and not t.get("started") and not t.get("done"))


def answered(root: Path, track: str) -> list[dict]:
    """To-dos the user has answered and nobody has picked up yet: the agent is unstuck."""
    return [t for t in open_items(root, track) if answered_one(t)]


def answer(root: Path, track: str, n: int, text: str) -> tuple[bool, str]:
    """The user's answer to a to-do's question, from the terminal, on the record.

    THE OTHER HALF OF `ask`. The agent parked a question; the user reads it in `journal
    todo` and answers here without opening a session. The to-do is ready again and goes
    first: the next stop tells the agent which question was answered and what the answer
    was, and hands it that to-do before any other.
    """
    text = " ".join((text or "").split())
    if not text:
        return False, 'say the answer: journal todos answer <n> "<the answer>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    if not t.get("asks"):
        return False, f"to-do {n} is not waiting on a question; `journal todos start {n}` picks it up"
    _update(root, track, n, answer=text)
    return True, f"answered to-do {n}: {t['title']}\n  the agent is told at its next stop and picks it up first"


def ask(root: Path, track: str, n: int, question: str) -> tuple[bool, str]:
    """Mark a to-do as waiting on the user, with the question it waits on.

    THE WAY AUTO SKIPS WITHOUT FORGETTING. An agent working through a list meets a to-do
    whose brief leaves a decision only the user can make. Without this it asks, the turn
    ends, and the next hold names the same to-do again — a loop with the user as the
    exit. With it the question is on the record, the hold names the next to-do that is
    not waiting, the start block shows the user what is waiting on them, and `start`
    picks it up once they have answered.
    """
    question = " ".join((question or "").split())
    if not question:
        return False, 'say what the user must decide: journal todos ask <n> "<the question>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, asks=question, started="")
    return True, f"to-do {n} waits on the user: {question}"


def _get(root: Path, track: str, n: int) -> tuple[dict | None, str]:
    items = {t["n"]: t for t in _all(root, track)}
    if n not in items:
        return None, f"there is no to-do {n} on environment `{track}`. `journal todo` numbers them."
    return items[n], ""


def add(root: Path, track: str, title: str, body: str, at: str, where: dict | None = None) -> tuple[bool, str]:
    """Write one. Refuses an empty title and a duplicate open one."""
    title = " ".join((title or "").split())
    if not title:
        return False, 'a to-do needs a title: journal todos add "<what, in a few words>"'
    for t in open_items(root, track):
        if t["title"].lower() == title.lower():
            return False, f"already waiting as to-do {t['n']} — nothing to add"
    items = _all(root, track)
    n = (items[-1]["n"] if items else 0) + 1
    path = folder(root, track) / f"{n:03d}-{_slug(title)}.md"
    meta = {"title": title, "track": track, "at": at, **{k: str(v) for k, v in (where or {}).items()}}
    _write(path, meta, body)
    return True, f"to-do {n} on `{track}`: {title}\n  {path.relative_to(root.parent)}"


def _update(root: Path, track: str, n: int, **fields) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    meta = {k: t.get(k, "") for k in FIELDS}
    meta.update({k: v for k, v in fields.items()})
    _write(t["path"], meta, t["body"])
    return {**t, **meta}, ""


_HEADING = re.compile(r"^##\s+(.+?)\s*$")


def _sections(body: str) -> list[tuple[str, str]]:
    """[(title, text)], in the order they appear in the body.

    A SECTION IS AN ATX `## <name>` HEADING plus everything up to the next one or the
    end of the file — level 2, deliberately, so it never collides with a `# <title>` a
    hand-written brief might already carry. The stretch before the first heading (most
    briefs, today) is title "". `text` includes its own heading line for a named
    section, so `"\\n".join(text for _, text in sections)` reproduces the body exactly —
    that is what `replace_section` relies on to touch only the one section it names.
    """
    lines = (body or "").split("\n")
    out: list[tuple[str, str]] = []
    title = ""
    buf: list[str] = []
    for line in lines:
        m = _HEADING.match(line)
        if m:
            out.append((title, "\n".join(buf)))
            title, buf = m.group(1).strip(), [line]
        else:
            buf.append(line)
    out.append((title, "\n".join(buf)))
    return out


def _snapshot(t: dict) -> Path:
    """Copy the whole file, unchanged, to struck/ before it is rewritten.

    A to-do has no per-part files to move individually the way a doc's part does, so the
    whole file is the snapshot. NOTHING IS EVER DELETED holds here too: the file named
    here is the pre-edit brief, in full, reachable after the edit that replaced it.
    """
    struck_dir = t["path"].parent / STRUCK
    struck_dir.mkdir(exist_ok=True)
    # MICROSECONDS, NOT SECONDS: two edits inside one automated run (a test, a script)
    # land inside the same second often enough that a coarser stamp would make the
    # second snapshot silently overwrite the first — the exact silent loss this whole
    # mechanism exists to prevent.
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    dst = struck_dir / f"{t['path'].stem}-{stamp}.md"
    dst.write_text(t["path"].read_text())
    return dst


def amend(root: Path, track: str, n: int, title: str, addition: str) -> tuple[bool, str]:
    """Append a NEW `## <title>` section to a brief. Mirrors `docs.part`.

    Refuses a title that already names a section — journal todos replace updates one of
    those — and refuses an empty addition, the same discipline `journal todos add`
    already applies to an empty title: a write that reports success and lands wrong is
    the one failure this project exists to prevent.
    """
    title = " ".join((title or "").split())
    if not title:
        return False, 'amend wants a section title: journal todos amend <n> "<section title>" --brief'
    addition = (addition or "").rstrip("\n")
    if not addition.strip():
        return False, "amend wants a body on stdin — pass it with --brief"
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if any(existing.lower() == title.lower() for existing, _ in _sections(t["body"]) if existing):
        return False, (f'to-do {n} already has a section called "{title}" — '
                        f'journal todos replace {n} "{title}" updates it')
    _snapshot(t)
    sep = "\n\n" if t["body"].strip() else ""
    new_body = t["body"].rstrip("\n") + sep + f"## {title}\n{addition}\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, f'to-do {n}: added section "{title}"\n  the old brief is kept under {STRUCK}/'


def replace_section(root: Path, track: str, n: int, title: str, new_text: str) -> tuple[bool, str]:
    """Replace ONE named section, byte-for-byte elsewhere; without a title, the whole
    body. Mirrors `docs.replace`. A title that names no section refuses and lists what
    the brief does have, rather than guessing or silently appending.
    """
    new_text = (new_text or "").rstrip("\n")
    if not new_text.strip():
        return False, "replace wants a body on stdin — pass it with --brief"
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    title = " ".join((title or "").split())
    sections = _sections(t["body"])
    if not title:
        _snapshot(t)
        _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_text + "\n")
        return True, f"to-do {n}: the whole brief replaced\n  the old one is kept under {STRUCK}/"
    named = [s for s in sections if s[0]]
    match = next((s for s in named if s[0].lower() == title.lower()), None)
    if match is None:
        have = ", ".join(f'"{s[0]}"' for s in named) or "none — this brief has no `## ` sections yet"
        return False, f'to-do {n} has no section called "{title}". It has: {have}'
    _snapshot(t)
    rebuilt = [f"## {title}\n{new_text}" if existing.lower() == title.lower() else text
               for existing, text in sections]
    new_body = "\n".join(rebuilt)
    if not new_body.endswith("\n"):
        new_body += "\n"
    _write(t["path"], {k: t.get(k, "") for k in FIELDS}, new_body)
    return True, f'to-do {n}: section "{title}" replaced\n  the old brief is kept under {STRUCK}/'


def start(root: Path, track: str, n: int, at: str, strict: bool = False) -> tuple[dict | None, str]:
    t, err = _get(root, track, n)
    if t is None:
        return None, err
    if t.get("done"):
        return None, f"to-do {n} is already done ({t.get('how') or 'no reason recorded'})"
    if strict and t.get("asks") and not t.get("answer"):
        # A DELEGATED ACTOR CANNOT REACH THE USER: what waits on them is not startable for
        # it. A session may start it — the user answered in the conversation.
        nxt = next((x for x in ready(root, track) if x["n"] != n), None)
        return None, (f"to-do {n} waits on the user: {t['asks']}" + (f" — next ready: {nxt['n']} ({nxt['title']})" if nxt
                      else " — nothing else is ready"))
    return _update(root, track, n, started=at)  # the question and its answer stay, as history


def done(root: Path, track: str, n: int, how: str, at: str) -> tuple[bool, str]:
    how = " ".join((how or "").split())
    if not how:
        return False, 'say how it was resolved: journal todos done <n> "<how>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if t.get("done"):
        return False, f"to-do {n} is already done ({t.get('how')})"
    _update(root, track, n, done=at, how=how)
    return True, f"done {n}: {t['title']}\n  {how}"


def reopen(root: Path, track: str, n: int, why: str, at: str) -> tuple[bool, str]:
    """Undo a close, on the record.

    THE PRICE OF CLOSING A TO-DO AUTOMATICALLY. `done` is a field with no verb that cleared
    it, so a wrong number — a typo in a commit trailer, a close that fired on the wrong
    environment — could only be undone by hand-editing the markdown. Nothing that closes
    without a human in the loop should be that expensive to reverse. The reason is required
    and the old close is kept beside it, so a reopen is auditable rather than silent.
    """
    why = " ".join((why or "").split())
    if not why:
        return False, 'say why it is open again: journal todos reopen <n> "<why>"'
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    if not t.get("done"):
        return False, f"to-do {n} is not done — nothing to reopen"
    was = t.get("how") or "no reason recorded"
    _update(root, track, n, done="", how="", reopened=f"{at} · {why} (was closed: {was})")
    return True, f"reopened {n}: {t['title']}\n  {why}\n  the close it undoes: {was}"


def close_titled(root: Path, track: str, title: str, at: str) -> str | None:
    """When work with a to-do's title ends, the to-do is done too. The number, if so."""
    want = " ".join(title.split()).lower()
    for t in open_items(root, track):
        if t["title"].lower() == want and t.get("started"):
            _update(root, track, t["n"], done=at, how="closed with the work of the same name")
            return str(t["n"])
    return None


# ─────────────────────────────── closing from a commit message ────────────────────────────
#: THE PROTOCOL. A commit that finishes a to-do says so in a trailer, in the CLI's own
#: spelling, on its own line in the message:
#:
#:      Journal: todos done 990
#:      Journal: todos done cli-streamline/4 the cap landed with the page
#:
#: A TRAILER, NEVER PROSE. Commit messages here argue, at length, about to-dos — "this
#: closes the placement question" is a sentence, not an instruction, and a matcher loose
#: enough to read it is loose enough to close the wrong thing. The line must start with the
#: trailer and spell the command. `#990` is not used: it belongs to the forge.
#:
#: AT COLUMN 0, AND FOR ONE REASON: a message that DOCUMENTS this protocol shows an example,
#: and an example is indented. Leading whitespace was allowed at first and the commit that
#: added the feature came within one line of closing a to-do numbered in its own changelog.
#: Anywhere in the message is fine — the footer, beside the other trailers, is where it is
#: read — but a line with a space in front of it is a quotation, not an instruction.
#:
#: THE NUMBER IS PER ENVIRONMENT, so `990` alone is ambiguous across a project with several.
#: It resolves against the session's environment first, then against the only environment that
#: has that number — and REFUSES when more than one does, because a close nobody can see is
#: worse than a close that did not happen. `<environment>/<n>` says it outright.
def now() -> str:
    """One timestamp shape, for the callers that write a to-do without going through the CLI."""
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


TRAILER = "Journal:"
_TRAILER = re.compile(r"^Journal:[ \t]*todos?[ \t]+done[ \t]+"
                      r"(?:(?P<env>[A-Za-z0-9][A-Za-z0-9 _.-]*?)/)?(?P<n>\d+)[ \t]*(?P<how>.*)$",
                      re.IGNORECASE | re.MULTILINE)


def commit_at(project: Path, ref: str = "HEAD") -> tuple[str, str, str] | None:
    """A commit as (sha, subject, whole message), or None where there is no such commit.

    READ THE COMMIT, NOT THE COMMAND that made it. The command is what was asked for; the
    commit is what happened — so a commit a gate rejected closes nothing, and `-m`, `-F -`
    and an editor session all parse the same, because none of them are parsed at all.
    """
    import subprocess
    try:
        p = subprocess.run(["git", "log", "-1", "--format=%H%n%s%n%B", ref], cwd=str(project),
                           capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    if p.returncode != 0 or not p.stdout.strip():
        return None
    sha, _, rest = p.stdout.partition("\n")
    subject, _, body = rest.partition("\n")
    return sha.strip(), subject.strip(), body


def refs_in(message: str) -> list[tuple[str | None, int, str]]:
    """Every close the message asks for: (environment or None, number, the how it gave)."""
    out = []
    for m in _TRAILER.finditer(message or ""):
        out.append((" ".join(m.group("env").split()) if m.group("env") else None,
                    int(m.group("n")), " ".join(m.group("how").split())))
    return out


def environments_with_todos(root: Path) -> list[str]:
    """The environment names that own at least one to-do, read off the to-dos themselves."""
    d = root / DIR
    names = []
    for sub in sorted(d.iterdir()) if d.is_dir() else []:
        if not sub.is_dir():
            continue
        first = next((_parse(f) for f in sorted(sub.glob("*.md"))), None)
        names.append((first or {}).get("track") or sub.name)
    return names


def close_from_commit(root: Path, message: str, how_default: str, at: str,
                      here: str | None = None) -> list[tuple[bool, str]]:
    """Act on every trailer in a commit message.

    Back comes one (did it close, what to say) per ref — the caller writes the headline,
    because "the trailer closed what it named" is a lie when the number was wrong, and a
    hook that overstates what it did is one an agent learns to skim.
    """
    said: list[tuple[bool, str]] = []
    for env, n, how in refs_in(message):
        if env is None:
            seen: set[str] = set()
            owners = []
            for e in ([here] if here else []) + environments_with_todos(root):
                if e not in seen and _get(root, e, n)[0] is not None:
                    seen.add(e)
                    owners.append(e)
            if not owners:
                said.append((False, f"to-do {n}: no environment has one — nothing closed"))
                continue
            if len(owners) > 1 and (here not in owners):
                said.append((False, f"to-do {n} is ambiguous — {', '.join(owners)} all have one. "
                                    f"Spell it: {TRAILER} todos done <environment>/{n}"))
                continue
            env = here if here in owners else owners[0]
        t, err = _get(root, env, n)
        if t is None:
            said.append((False, err))
            continue
        if t.get("done"):
            # AN AMEND OR A REBASE RUNS THE HOOK AGAIN over the same message. That is a
            # no-op with a note, not a failure: nothing about the record is wrong.
            said.append((False, f"to-do {n} on `{env}` was already closed ({t.get('how')}) — left as it is"))
            continue
        ok, msg = done(root, env, n, how or how_default, at)
        said.append((ok, msg.splitlines()[0] + f" (on `{env}`)" if ok else msg))
    return said


def _age(at: str) -> str:
    from pins import age
    return age(at) if at else ""


def render(root: Path, track: str, *, all_of_them: bool = False, width: int = 88, short_refs: bool = False,
           cap: int | None = None, page: int = 1, order: str = fmt.DESC) -> str:
    """The list as a person reads it: the title, where it stands, and any question below.

    CAPPED LIKE `carry` (below), for the same reason: a bare `journal todo` is asked for
    fresh each time rather than handed automatically, so it pages past the cap instead
    of just saying how many more there are. `cap` is None by default — the environment
    pickup page (`tracks.page`) calls this uncapped on purpose: a runner has to see the
    WHOLE ordered list, not the first page of it.
    """
    items = _all(root, track) if all_of_them else open_items(root, track)
    if not items:
        return "  Nothing is waiting." if not all_of_them else "  No to-dos on this environment."
    items, left = fmt.paged(items, cap, page, order)
    out = []
    for t in items:
        if t.get("done"):
            meta = f"done {_age(t['done'])}: {t.get('how') or 'no reason recorded'}"
        elif answered_one(t):
            meta = "answered by the user, not yet picked up"
        elif t.get("asks"):
            meta = "waits on the user"
        elif t.get("started"):
            meta = f"started {_age(t['started'])}, work is open"
        else:
            meta = f"waiting {_age(t.get('at', ''))}" if _age(t.get("at", "")) else "waiting"
        meta += " · has a brief" if t["body"] else " · title only"
        if t.get("doc"):
            import docs as docs_mod
            meta += " · → " + docs_mod.ref_label(root, str(t["doc"]), short=short_refs)
        entry = fmt.numbered(t["n"], t["title"], meta, struck=bool(t.get("done")), width=width)
        if t.get("asks") and not t.get("done") and not t.get("started"):
            entry += "\n" + fmt.wrap("? " + t["asks"], indent=5, width=width)
            if t.get("answer"):
                entry += "\n" + fmt.wrap("→ " + t["answer"], indent=5, width=width)
        out.append(entry)
    body = "\n\n".join(out)
    body += fmt.more("todos", left, page, order)
    return body


def show(root: Path, track: str, n: int, width: int = 88) -> tuple[bool, str]:
    t, err = _get(root, track, n)
    if t is None:
        return False, err
    meta = [f"environment {track}"]
    if t.get("at"):
        meta.append(f"written {_age(t['at'])} ({t['at'][:10]})")
    if t.get("line"):
        meta.append(f"line {t['line']}")
    if t.get("started"):
        meta.append(f"started {_age(t['started'])}")
    if t.get("done"):
        meta.append(f"done {_age(t['done'])}: {t.get('how')}")
    if t.get("doc"):
        import docs as docs_mod
        meta.append("→ " + docs_mod.ref_label(root, str(t["doc"])))
    out = [fmt.title(f"TO-DO {n}", sub=" ".join(t["title"].split())), "  " + fmt.dim(" · ".join(meta))]
    if t.get("asks"):
        out.append(fmt.section("the user answered" if t.get("answer") else "waiting on the user"))
        out.append(fmt.wrap(t["asks"], width=width))
        if t.get("answer"):
            out.append("")
            out.append(fmt.wrap("→ " + t["answer"], width=width))
    out.append(fmt.section("brief"))
    # fmt.BLOCK, NOT fmt.wrap: wrap joins every line of a paragraph into one, which
    # swallows an indented list and a `## ` heading alike into run-on prose — and a
    # brief has no reader-visible section structure until its headings survive being
    # read back. block keeps an indented line, a list item and a command as written.
    out.append(fmt.block(t["body"], width=width) if t["body"] else "  (title only; no brief was written)")
    out.append("")
    rows = []
    if not t.get("done"):
        rows.append((f"journal todos start {n}", "pick it up"))
        rows.append((f'journal todos done {n} "<how>"', "close it without starting"))
        if t.get("asks") and not t.get("answer"):
            rows.append((f'journal todos answer {n} "<answer>"', "answer it (the user)"))
        elif not t.get("asks"):
            rows.append((f'journal todos ask {n} "<question>"', "it waits on the user"))
    if rows:
        out.append(fmt.commands(rows))
    out.append("  " + fmt.dim(str(t["path"].relative_to(root.parent))))
    return True, "\n".join(out)


AUTO = "auto"


def auto(root: Path, track: str) -> bool:
    """May the agent work through this environment's list without asking?

    OFF BY DEFAULT, AND THE DEFAULT IS THE POINT. A to-do is work the user put off, and
    whether it gets picked up is their call — unless they have said, for this environment, that
    the agent should work through the list on its own. The flag is that saying, on the
    record, per environment: an environment of chores can drain while an environment of design questions waits.
    """
    got = state.get(root, AUTO, {})
    return bool(isinstance(got, dict) and got.get(track))


def set_auto(root: Path, track: str, on: bool) -> str:
    with state.locked(root):
        got = state.get(root, AUTO, {})
        got = got if isinstance(got, dict) else {}
        got[track] = bool(on)
        state.put(root, AUTO, got)
    return (f"auto ON for `{track}`: whenever no work is open, the agent picks up the next "
            "to-do on its own and keeps going until the list is empty.\n"
            "  START A LOOP NOW, or nothing will wake this session at its next idle stop and "
            "the list will sit where it is:\n"
            "    the `loop` skill with `15m journal next`\n"
            "  Until one is running (or `journal loop set` says one is), the next write is "
            "refused — auto without a loop is a promise nothing keeps."
            if on else
            f"auto OFF for `{track}`: to-dos are listed and never started without the user's word.")


def _loop_line(root: Path) -> str:
    from settings import load
    m = load(root)[0].get("auto_loop_minutes", 0)
    if not m:
        return ""
    return (f"Keep a loop running while auto is on, if none is: the `loop` skill with "
            f"`{m}m journal next`, so an idle session comes back every {m} minutes and carries "
            "on until nothing is left it can do.")


def carry(root: Path, track: str) -> str:
    """The block a session start hands over. Titles only; what it asks depends on auto."""
    waiting = open_items(root, track)
    if not waiting:
        return ""
    def line(t):
        s = f"  {t['n']:>3}  {t['title']}"
        if answered_one(t):
            s += f"\n       ANSWERED by the user: {t['answer']}\n       (the question was: {t['asks']})"
        elif t.get("asks") and not t.get("started"):
            s += f"\n       waiting on the user: {t['asks']}"
        return s
    titles = "\n".join(line(t) for t in sorted(waiting, key=lambda t: 0 if answered_one(t) else 1))
    blocked = asking(root, track)
    unstuck = answered(root, track)
    lead = (f"{len(unstuck)} of these the user has ANSWERED since they were parked — pick those up "
            "first.\n" if unstuck else "")
    if auto(root, track):
        return (
            f"TO DO on this environment, {len(waiting)} waiting — AUTO MODE IS ON: this list is worked "
            "through without asking. Whenever nothing is open, pick up the next one with "
            "`journal todos start <n>`, solve it yourself, `journal work end` it, and keep going "
            "until the list is empty. Every choice a brief leaves open is yours: make it, write it "
            "in `journal work update`, carry on. Ask the user only when you cannot proceed without "
            "something only they can supply, or the hook says you are stalled — then `journal todos add "
            'ask <n> "<what is stuck>"` and move to the next. ' + _loop_line(root)
            + "\n" + lead + titles
            + (f"\n{len(blocked)} of these wait on the user; the questions are above. When the "
               "user answers, `journal todos start <n>`." if blocked else "")
            + "\n`journal todos <n>` reads the brief; `journal todos auto off` turns this off."
        )
    return (
        f"TO DO on this environment, {len(waiting)} waiting — delayed work, not an instruction to "
        "start any of it. Start one only when the user says so, or asks you to work through "
        "them (then offer `journal todos auto on`). A to-do the user has ANSWERED is theirs "
        "saying to do it: start it.\n" + lead + titles
        + "\n`journal todos <n>` reads the brief; `journal todos start <n>` picks one up."
    )
