from __future__ import annotations

import re
from pathlib import Path

import entries
import fmt
import state
from pins import age
from templates import render

KEY = "questions"

KINDS = {"todo": "to-do", "doc": "doc", "pin": "pin", "rule": "rule", "inbox": "inbox message"}

_REF = re.compile(r"^\s*(to-?dos?|docs?|pins?|rules?|inbox)\s*[:#\s]\s*(\d+(?:\.\d+)?)\s*$", re.I)

MESSAGES = {
    "label": "{kind} {num}",
    "not_a_ref": "{text} is not a reference; write one as `todo 22`, `doc 4.1`, `pin 3`, `rule 2` or `inbox 5`",
    "part_on_non_doc": "only a doc takes a part number; {text} names a {kind}",
    "no_todo": "there is no to-do {n} on this environment",
    "no_entry": "there is no {kind} {n}. `journal {key}` numbers them.",
    "no_question": "there is no question {n}. `journal questions` numbers them.",
    "fact_withdrawn": "withdrawn: {why}",
    "fact_answered": "answered: {answer}",
    "fact_open": "open",
    "fact_about": "about {links}",
    "needs_text": 'a question needs its text: journal questions add "<question>"',
    "added": "question {n}[, about {links}] ({open} open)",
    "edited": "question {n} now reads: {text}",
    "needs_answer": 'say the answer: journal questions answer {n} "<the answer>"',
    "answered": "{verb} question {n}: {text}\n  the agent is told at its next stop",
    "already_about": "question {n} is already about {ref}",
    "now_about": "question {n} is now about {links}",
    "not_about": "question {n} is not about {ref}",
    "no_longer_about": "question {n} is no longer about {ref}; it is about {left}",
    "show_head": "QUESTION {n}[  {age}]\n\n{text}\n\n  about: {links}",
    "show_withdrawn": "  withdrawn: {why}",
    "show_answered": "\n  ANSWERED[ {age}]\n{answer}",
    "show_open": '\n  open — journal questions answer {n} "<the answer>"',
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    word, num = m.group(1).lower().replace("-", ""), m.group(2)
    kind = word.rstrip("s") if word != "todos" else "todo"
    if kind not in KINDS:
        kind = "todo"
    if "." in num and kind != "doc":
        return None, say("part_on_non_doc", text=repr(text), kind=KINDS[kind])
    return f"{kind}:{num}", ""


def label(ref: str) -> str:
    kind, _, num = ref.partition(":")
    return say("label", kind=KINDS.get(kind, kind), num=num)


def labels(refs: list[str]) -> list[str]:
    return [label(r) for r in refs]


def check_ref(root: Path, ref: str, track: str | None = None) -> str | None:
    import pins
    kind, _, num = ref.partition(":")
    if kind == "doc":
        import docs
        return docs.check_ref(root, num)
    n = int(num)
    if kind == "inbox":
        import inbox
        return None if 1 <= n <= len(inbox._all(root, track)) else say("no_entry", kind=KINDS[kind], n=n, key="inbox")
    if kind == "todo":
        import todo
        t, err = todo.item(root, track or state.current_track(root), n)
        return None if t else (err or say("no_todo", n=n))
    key = pins.RULES if kind == "rule" else pins.KEY
    if 1 <= n <= len(pins._all(root, key, track)):
        return None
    return say("no_entry", kind=kind, n=n, key=key)


def _facts(q: dict, n: int) -> list[str]:
    if q.get("withdrawn"):
        out = [say("fact_withdrawn", why=q["withdrawn"])]
    elif q.get("answer"):
        out = [say("fact_answered", answer=q["answer"])]
    else:
        out = [say("fact_open")]
    if age(q.get("at", "")):
        out.append(age(q.get("at", "")))
    if q.get("links"):
        out.append(say("fact_about", links=labels(q["links"])))
    return out


_STORE = entries.Store(key=KEY, noun="question", text="text", retired="withdrawn",
                       verb="withdrawn", facts=_facts)


def _all(root: Path, track: str | None = None) -> list[dict]:
    return entries.all_of(root, _STORE, track=track)


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def is_open(q: dict) -> bool:
    return not q.get("answer") and not q.get("withdrawn")


def open_items(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, q) for n, q in enumerate(_all(root, track), 1) if is_open(q)]


def about(root: Path, ref: str, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, q) for n, q in enumerate(_all(root, track), 1)
            if ref in (q.get("links") or []) and not q.get("withdrawn")]


def untold(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    # a question about a to-do is announced with its to-do, not on its own
    return [(n, q) for n, q in enumerate(_all(root, track), 1)
            if q.get("answer") and not q.get("withdrawn") and not q.get("told_at")
            and not any(r.startswith("todo:") for r in q.get("links") or [])]


def mark_told(root: Path, track: str | None, ns: list[int], at: str) -> None:
    with state.locked(root):
        items = _all(root, track)
        for n in ns:
            if 1 <= n <= len(items):
                items[n - 1]["told_at"] = at
        _put(root, items, track)


def _refs(root: Path, raw: list[str], track: str | None = None) -> tuple[list[str], str]:
    out = []
    for text in raw:
        ref, why = parse_ref(text)
        if ref is None:
            return [], why
        why = check_ref(root, ref, track)
        if why:
            return [], why
        if ref not in out:
            out.append(ref)
    return out, ""


def add(root: Path, text: str, at: str, about_refs: list[str] | None = None,
        source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    links, why = _refs(root, about_refs or [], track)
    if why:
        return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "source": source, "links": links,
                      "answer": None, "answered_at": None, "told_at": None, "withdrawn": None})
        _put(root, items, track)
        n = len(items)
    return True, say("added", n=n, links=labels(links), open=len(open_items(root, track)))


def _find(items: list[dict], n: int) -> tuple[dict | None, str]:
    return entries._find(items, n, _STORE)


def answer(root: Path, n: int, text: str, at: str, track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_answer", n=n)
    with state.locked(root):
        items = _all(root, track)
        q, why = _find(items, n)
        if q is None:
            return False, why
        again = bool(q.get("answer"))
        if again:
            q.setdefault("earlier_answers", []).append({"answer": q["answer"], "at": q.get("answered_at")})
        q.update(answer=text, answered_at=at, told_at=None)
        _put(root, items, track)
    return True, say("answered", verb="re-answered" if again else "answered", n=n, text=q["text"][:70])


def edit(root: Path, n: int, text: str, track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    with state.locked(root):
        items = _all(root, track)
        q, why = _find(items, n)
        if q is None:
            return False, why
        q["text"] = text
        _put(root, items, track)
    return True, say("edited", n=n, text=text[:70])


def link(root: Path, n: int, raw: str) -> tuple[bool, str]:
    refs, why = _refs(root, [raw])
    if why:
        return False, why
    ref = refs[0]
    with state.locked(root):
        items = _all(root)
        q, why = _find(items, n)
        if q is None:
            return False, why
        links = q.setdefault("links", [])
        if ref in links:
            return False, say("already_about", n=n, ref=label(ref))
        links.append(ref)
        _put(root, items)
    return True, say("now_about", n=n, links=labels(links))


def unlink(root: Path, n: int, raw: str) -> tuple[bool, str]:
    ref, why = parse_ref(raw)
    if ref is None:
        return False, why
    with state.locked(root):
        items = _all(root)
        q, why = _find(items, n)
        if q is None:
            return False, why
        links = q.get("links") or []
        if ref not in links:
            return False, say("not_about", n=n, ref=label(ref))
        links.remove(ref)
        _put(root, items)
    return True, say("no_longer_about", n=n, ref=label(ref), left=labels(links) or "nothing")


def withdraw(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    return entries.retire(root, _STORE, n, why, at)


def show(root: Path, n: int) -> tuple[bool, str]:
    items = _all(root)
    if n < 1 or n > len(items):
        return False, say("no_question", n=n)
    q = items[n - 1]
    text = say("show_head", n=n, age=age(q.get("at", "")), text=fmt.wrap(q["text"], indent=2),
               links=labels(q.get("links") or []) or "nothing linked")
    if q.get("withdrawn"):
        tail = say("show_withdrawn", why=q["withdrawn"])
    elif q.get("answer"):
        tail = say("show_answered", age=age(q.get("answered_at") or ""), answer=fmt.wrap(q["answer"], indent=4))
    else:
        tail = say("show_open", n=n)
    return True, text + "\n" + tail


def _ordered(root: Path, all_of_them: bool, order: str, track: str | None = None) -> list[tuple[int, dict]]:
    kept = [(n, q) for n, q in enumerate(_all(root, track), 1) if all_of_them or not q.get("withdrawn")]
    rank = lambda q: 2 if q.get("withdrawn") else (1 if q.get("answer") else 0)  # noqa: E731
    sign = -1 if order == fmt.DESC else 1
    return sorted(kept, key=lambda p: (rank(p[1]), sign * p[0]))


def listing(root: Path, *, all_of_them: bool = False, cap: int | None = None,
            page: int = 1, order: str = fmt.DESC):
    return entries.listing(_ordered(root, all_of_them, order), lambda p: fmt.Item(
        n=p[0], text=p[1]["text"], meta=" · ".join(_facts(p[1], p[0])),
        struck=bool(p[1].get("withdrawn"))), cap=cap, page=page, order=fmt.ASC)


def row_response(n: int, q: dict) -> dict:
    return {
        "n": n, "text": q["text"], "status": ("withdrawn" if q.get("withdrawn")
                                             else "answered" if q.get("answer") else "open"),
        "answer": q.get("answer") or "", "age": age(q.get("at", "")),
        "answered_age": age(q.get("answered_at") or ""), "source": q.get("source") or "",
        "withdrawn": q.get("withdrawn") or "",
        "links": [{"ref": r, "label": label(r)} for r in q.get("links") or []],
    }


def rows_response(root: Path, track: str | None = None, *, all_of_them: bool = False) -> list[dict]:
    return [row_response(n, q) for n, q in _ordered(root, all_of_them, fmt.DESC, track)]
