from __future__ import annotations

import re
from pathlib import Path

import entries
import fmt
import state
from pins import age

KEY = "questions"

KINDS = {"todo": "to-do", "doc": "doc", "pin": "pin", "rule": "rule"}

_REF = re.compile(r"^\s*(to-?dos?|docs?|pins?|rules?)\s*[:#\s]\s*(\d+(?:\.\d+)?)\s*$", re.I)


def parse_ref(text: str) -> tuple[str | None, str]:
    m = _REF.match(text or "")
    if not m:
        return None, (f"{text!r} is not a reference; write one as `todo 22`, `doc 4.1`, "
                      "`pin 3` or `rule 2`")
    word, num = m.group(1).lower().replace("-", ""), m.group(2)
    kind = word.rstrip("s") if word != "todos" else "todo"
    if kind not in KINDS:
        kind = "todo"
    if "." in num and kind != "doc":
        return None, f"only a doc takes a part number; {text!r} names a {KINDS[kind]}"
    return f"{kind}:{num}", ""


def label(ref: str) -> str:
    kind, _, num = ref.partition(":")
    return f"{KINDS.get(kind, kind)} {num}"


def check_ref(root: Path, ref: str, track: str | None = None) -> str | None:
    import pins
    kind, _, num = ref.partition(":")
    if kind == "doc":
        import docs
        return docs.check_ref(root, num)
    n = int(num)
    if kind == "todo":
        import todo
        t, err = todo.item(root, track or state.current_track(root), n)
        return None if t else (err or f"there is no to-do {n} on this environment")
    key = pins.RULES if kind == "rule" else pins.KEY
    have = len(pins._all(root, key, track))
    if 1 <= n <= have:
        return None
    return f"there is no {kind} {n}. `journal {key}` numbers them."


def _facts(q: dict, n: int) -> list[str]:
    out = []
    if q.get("withdrawn"):
        out.append(f"withdrawn: {q['withdrawn']}")
    elif q.get("answer"):
        out.append(f"answered: {q['answer']}")
    else:
        out.append("open")
    if age(q.get("at", "")):
        out.append(age(q.get("at", "")))
    if q.get("links"):
        out.append("about " + ", ".join(label(r) for r in q["links"]))
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
        return False, 'a question needs its text: journal questions add "<question>"'
    links, why = _refs(root, about_refs or [], track)
    if why:
        return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "source": source, "links": links,
                      "answer": None, "answered_at": None, "told_at": None, "withdrawn": None})
        _put(root, items, track)
        n = len(items)
    on = f", about {', '.join(label(r) for r in links)}" if links else ""
    return True, f"question {n}{on} ({len(open_items(root, track))} open)"


def _find(items: list[dict], n: int) -> tuple[dict | None, str]:
    return entries._find(items, n, _STORE)


def answer(root: Path, n: int, text: str, at: str, track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, f'say the answer: journal questions answer {n} "<the answer>"'
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
    return True, (f"{'re-answered' if again else 'answered'} question {n}: {q['text'][:70]}\n"
                  "  the agent is told at its next stop")


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
            return False, f"question {n} is already about {label(ref)}"
        links.append(ref)
        _put(root, items)
    return True, f"question {n} is now about {', '.join(label(r) for r in links)}"


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
            return False, f"question {n} is not about {label(ref)}"
        links.remove(ref)
        _put(root, items)
    left = ", ".join(label(r) for r in links) or "nothing"
    return True, f"question {n} is no longer about {label(ref)}; it is about {left}"


def withdraw(root: Path, n: int, why: str, at: str = "") -> tuple[bool, str]:
    return entries.retire(root, _STORE, n, why, at)


def show(root: Path, n: int) -> tuple[bool, str]:
    items = _all(root)
    if n < 1 or n > len(items):
        return False, f"there is no question {n}. `journal questions` numbers them."
    q = items[n - 1]
    lines = [f"QUESTION {n}  {age(q.get('at', ''))}".rstrip(), "", fmt.wrap(q["text"], indent=2), ""]
    lines.append("  about: " + (", ".join(label(r) for r in q.get("links") or []) or "nothing linked"))
    if q.get("withdrawn"):
        lines.append(f"  withdrawn: {q['withdrawn']}")
    elif q.get("answer"):
        lines += ["", f"  ANSWERED {age(q.get('answered_at', ''))}".rstrip(), fmt.wrap(q["answer"], indent=4)]
    else:
        lines += ["", f'  open — journal questions answer {n} "<the answer>"']
    return True, "\n".join(lines)


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
