from __future__ import annotations

import math
import re
from pathlib import Path

import fmt
import state
from pins import age
from templates import render

KEY = "reports"

KINDS = {"todo": "to-do", "question": "question", "plan": "plan", "doc": "doc"}

_REF = re.compile(r"^\s*(to-?dos?|questions?|plans?|docs?)\s*[:#\s]\s*(\d+)\s*$", re.I)

MESSAGES = {
    "needs_title": 'a report needs a title: journal reports add "<title>" --brief',
    "just_a_list": ("this reads as a list of things to do, not what you found. A report is the situation "
                    "as you found it — what was asked, what is true, what it means — and the work that "
                    "comes out of it goes on the list:\n"
                    '  journal todos add "<title>" --brief\n'
                    "Write the finding here and file the rows separately."),
    "needs_body": "a report needs its text — pass it on stdin with --brief",
    "not_a_ref": "{text} is not something a report answers; write `todo 22`, `question 4`, `plan 5` or `doc 3`",
    "no_todo": "there is no to-do {n} on this environment",
    "no_question": "there is no question {n} on this environment",
    "no_plan": "there is no plan {n} on this environment",
    "no_doc": "there is no doc {n} in this project",
    "added": "report {n}: {title}[ — for {about}]\n  the user reads it in the viewer; it is not a doc and is never handed to a session",
    "no_report": "there is no report {n}. `journal reports` numbers them.",
    "seen": "report {n} is marked seen",
    "archive_why": 'say why: journal reports archive {n} "<why>"',
    "already_archived": "report {n} is already archived",
    "archived": "report {n} is archived: {why}",
    "label": "{kind} {n}",
    "fact_for": "for {about}",
    "fact_archived": "archived: {why}",
    "expired": "older than {days} day(s)",
    "already_doc": "report {n} is already doc {doc}",
    "became_doc": "turned into doc {doc}",
    "to_doc": "report {n} is now doc {doc}; the doc is kept for good, the report is archived",
    "keep_usage": "journal reports keep <days>: how many days a report stays listed on this environment; 0 keeps them",
    "kept": "reports on `{env}` stay listed for {days} day(s), then are archived",
    "kept_always": "reports on `{env}` stay listed until archived by hand",
    "show": "REPORT {n}  {title}\n  {meta}\n\n{body}",
    "hint": "  this mentions a report: a report is the situation as you found it, written for the user —\n"
            '  journal reports add "<what was asked>" [--about="todo 22"] --brief. A doc is for what stays true.',
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


_MENTIONS = re.compile(r"\breports?\b", re.I)


def hint(*texts: str) -> str:
    """A reminder that reports exist, when what the agent is about to work from asks for one; else ""."""
    return say("hint") if any(_MENTIONS.search(t or "") for t in texts) else ""


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    word = m.group(1).lower()
    kind = "todo" if word.startswith("to") else word.rstrip("s")
    return f"{kind}:{m.group(2)}", ""


def label(ref: str) -> str:
    kind, _, n = ref.partition(":")
    return say("label", kind=KINDS.get(kind, kind), n=n) if ref else ""


def _check(root: Path, ref: str, track: str | None) -> str | None:
    kind, _, num = ref.partition(":")
    n = int(num)
    if kind == "plan":
        import plans
        return None if 1 <= n <= len(plans._all(root, track)) else say("no_plan", n=n)
    if kind == "doc":
        import docs
        return None if 1 <= n <= len(docs.all_docs(root)) else say("no_doc", n=n)
    if kind == "todo":
        import todo
        t, _ = todo.item(root, track or state.current_track(root), n)
        return None if t else say("no_todo", n=n)
    import questions
    return None if 1 <= n <= len(questions._all(root, track)) else say("no_question", n=n)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def seen(root: Path, n: int, at: str, track: str | None = None) -> tuple[bool, str]:
    """The user opened the report in the viewer; the first time is kept.

    A REPORT IS FOR THE USER, so "have they read it" is a fact about the report, the way it is
    for a question — it is what lets the home stop asking once they have.
    """
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_report", n=n)
        r = items[n - 1]
        if not r.get("seen_at"):
            r["seen_at"] = at
            _put(root, items, track)
    return True, say("seen", n=n)


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


#: what a line of a report has to have to count as prose rather than an item on a list
_PROSE_MIN = 40


def only_a_list(body: str) -> bool:
    """True when the body is a list of things to do and nothing else.

    RULE 9 EXISTS BECAUSE OF THIS FAILURE: research dispatched to a subagent ends in a REPORT, and
    filing the findings as to-dos is not a substitute. The shape that fails is a body with no prose
    in it at all — three or more bullets and nothing that reads as a sentence about what was found.
    A report that ARGUES and then lists is the normal case and passes: the list is not the problem,
    the absence of everything else is.
    """
    import questions
    lines = [ln.strip() for ln in (body or "").splitlines() if ln.strip()]
    bullets = questions._BULLET.findall(body or "")
    if len(bullets) < 3:
        return False
    prose = [ln for ln in lines
             if not questions._BULLET.match(ln) and not ln.startswith("#") and len(ln) >= _PROSE_MIN]
    return not prose


def add(root: Path, title: str, body: str, at: str, about: str = "", source: str = "cli",
        track: str | None = None) -> tuple[bool, str]:
    title = " ".join((title or "").split())
    if not title:
        return False, say("needs_title")
    if not (body or "").strip():
        return False, say("needs_body")
    if only_a_list(body):
        return False, say("just_a_list")
    ref = ""
    if about:
        ref, why = parse_ref(about)
        if ref is None:
            return False, why
        why = _check(root, ref, track)
        if why:
            return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"title": title, "body": body.strip(), "at": at, "source": source, "about": ref,
                      "archived": None, "archived_at": None})
        _put(root, items, track)
        n = len(items)
    # A REPORT IS ALREADY WAITING ON THE USER: it is a card in the rail's Waiting on you until it is
    # archived, which is a stronger telling than a line in the notifications list. Raising both meant
    # reading the same arrival twice — the user's own words, and the reason this notice is gone.
    return True, say("added", n=n, title=title, about=label(ref) or None)


def to_doc(root: Path, n: int, at: str, track: str | None = None) -> tuple[bool, str]:
    """Copy a report into a new document, which is never pruned; the report is archived and points at it."""
    import docs
    here = track or state.current_track(root)
    items = _all(root, here)
    if not 1 <= n <= len(items) or items[n - 1].get("removed"):
        return False, say("no_report", n=n)
    r = items[n - 1]
    if r.get("doc"):
        return False, say("already_doc", n=n, doc=r["doc"])
    first = next((l.strip("# ").strip() for l in r.get("body", "").splitlines() if l.strip()), r["title"])
    ok, message = docs.add(root, r["title"], first[:200], r.get("body", ""), here, source="report %d" % n)
    if not ok:
        return False, message
    import re as _re
    dn = int(_re.search(r"doc (\d+)", message).group(1))
    with state.locked(root):
        items = _all(root, here)
        items[n - 1]["doc"] = dn
        items[n - 1]["archived"] = say("became_doc", doc=dn)
        items[n - 1]["archived_at"] = at
        _put(root, items, here)
    return True, say("to_doc", n=n, doc=dn)


def archive(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    why = " ".join((why or "").split())
    if not why:
        return False, say("archive_why", n=n)
    with state.locked(root):
        items = _all(root, track)
        if not 1 <= n <= len(items):
            return False, say("no_report", n=n)
        r = items[n - 1]
        if r.get("archived"):
            return False, say("already_archived", n=n)
        r["archived"], r["archived_at"] = why, at
        _put(root, items, track)
    return True, say("archived", n=n, why=why)


ARCHIVE_DAYS = "reports_archive_days"
DEFAULT_ARCHIVE_DAYS = 7
REMOVE_DAYS = 30


def archive_days(root: Path, track: str) -> int:
    """How many days a report stays listed on this environment; 0 means until archived by hand."""
    got = state.get(root, ARCHIVE_DAYS, {})
    value = got.get(track) if isinstance(got, dict) else None
    return DEFAULT_ARCHIVE_DAYS if value is None else int(value)


def set_archive_days(root: Path, track: str, days: int) -> tuple[bool, str]:
    if days is None or int(days) < 0:
        return False, say("keep_usage")
    with state.locked(root):
        got = state.get(root, ARCHIVE_DAYS, {})
        got = got if isinstance(got, dict) else {}
        got[track] = int(days)
        state.put(root, ARCHIVE_DAYS, got)
    return True, say("kept", env=track, days=int(days)) if int(days) else say("kept_always", env=track)


def _age_days(r: dict) -> float | None:
    from datetime import datetime, timezone
    try:
        when = datetime.fromisoformat((r.get("at") or "").replace("Z", "+00:00"))
    except ValueError:
        return None
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - when).total_seconds() / 86400


def prune(root: Path, track: str | None = None) -> int:
    """Reports older than REMOVE_DAYS lose their title and text for good; the entry stays, so numbers do not shift."""
    from datetime import datetime, timezone
    import plans
    import retention
    linked = plans.linked_reports(root, track or state.current_track(root))
    # archived reports go for good after the environment's delete days; 0 keeps them
    remove = retention.days(root, track or state.current_track(root), "reports")["delete"]
    with state.locked(root):
        items = _all(root, track)
        gone = 0
        for n, r in enumerate(items, 1):
            if r.get("removed") or n in linked:
                continue
            days = _age_days(r)
            if days is not None and remove and days > remove:
                r.clear()
                r["removed"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
                gone += 1
        if gone:
            _put(root, items, track)
    return gone


def expired(r: dict, days: int) -> bool:
    """Older than the environment's setting, and not archived by hand: treated as archived, nothing is written."""
    if not days or r.get("archived") or not r.get("at"):
        return False
    from datetime import datetime, timezone
    try:
        when = datetime.fromisoformat(r["at"].replace("Z", "+00:00"))
    except ValueError:
        return False
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return (datetime.now(timezone.utc) - when).total_seconds() > days * 86400


def _expired_at(r: dict, days: int) -> str:
    """When a report aged out under the keep setting: written `days` days after it was."""
    from datetime import datetime, timedelta
    try:
        return (datetime.fromisoformat(r["at"].replace("Z", "+00:00")) + timedelta(days=days)).isoformat(timespec="seconds")
    except (KeyError, ValueError):
        return ""


def archived_why(r: dict, days: int) -> str:
    return r.get("archived") or (say("expired", days=days) if expired(r, days) else "")


def facts(r: dict, days: int = 0) -> str:
    out = [age(r.get("at", ""))] if age(r.get("at", "")) else []
    if r.get("about"):
        out.append(say("fact_for", about=label(r["about"])))
    if archived_why(r, days):
        out.append(say("fact_archived", why=archived_why(r, days)))
    return " · ".join(out)


def _ages_out_in(r: dict, days: int) -> int | None:
    """Whole days left before a report ages off the list; None when it never does or already has."""
    if not days or r.get("archived"):
        return None
    got = _age_days(r)
    return None if got is None or got > days else max(0, math.ceil(days - got))


def row_response(n: int, r: dict, body: bool = False, days: int = 0) -> dict:
    row = {"n": n, "title": r.get("title", ""), "gist": fmt.gist(" ".join((r.get("body") or "").split())),
           "at": r.get("at", ""), "age": age(r.get("at", "")) if r.get("at") else "", "about": r.get("about") or "",
           "about_label": label(r.get("about") or ""), "archived": archived_why(r, days), "meta": facts(r, days),
           "closed_at": r.get("archived_at") or (_expired_at(r, days) if expired(r, days) else ""),
           "doc": r.get("doc") or None, "ages_out_in": _ages_out_in(r, days),
           "seen": bool(r.get("seen_at")), "seen_at": r.get("seen_at") or ""}
    if body:
        row["body"] = r.get("body", "")
    return row
