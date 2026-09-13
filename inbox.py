from __future__ import annotations

import re
from pathlib import Path

import fmt
import state
from pins import age
from templates import render

KEY = "inbox"

KINDS = {"todo": "to-do", "pin": "pin", "rule": "rule", "reminder": "reminder", "question": "question"}
PLAIN = ("work", "noted")

_REF = re.compile(r"^\s*(to-?dos?|pins?|rules?|reminders?|questions?)\s*[:#\s]\s*(\d+)\s*$", re.I)

MESSAGES = {
    "edited": "message {n} is updated",
    "move_where": 'say where: journal messages move {n} "<environment>"',
    "move_none": "there is no environment {dst}",
    "move_same": "message {n} is already on {env}",
    "moved": "message {n} moved to {env}, where it is message {there}",
    "fact_moved": "moved to {to}",
    "not_a_ref": "{text} is not something a part becomes; write `todo 22`, `pin 3`, `rule 2`, `reminder 1`, "
                 "`question 4`, `work` or `noted`",
    "no_entry": "there is no {kind} {n} for a part to have become",
    "label": "{kind} {n}",
    "plain_work": "a work update",
    "plain_noted": "noted",
    "needs_text": 'a message needs its text: journal messages add "<message>"',
    "added": "message {n} is left for the agent ({waiting} waiting to be processed)",
    "no_such": "there is no message {n}. `journal messages` numbers them.",
    "needs_part": 'say which part: journal messages process {n} --part="<the words it is about>" --became=<what it became>',
    "needs_became": 'say what the part became: --became="todo 22", "pin 3", "question 4", work or noted',
    "not_in_message": "that part is not in message {n}; quote the words it is about",
    "already_processed": "message {n} is already processed",
    "part_recorded": "message {n}: «{excerpt}» became {became:, } ({parts} part(s) recorded)",
    "no_parts": "message {n} has no parts yet; record what each part became first: "
                'journal messages process {n} --part="<words>" --became=noted',
    "done": "message {n} is processed: it became {became:, } ({waiting} waiting)",
    "fact_waiting": "waiting",
    "fact_processed": "processed[ {age}]",
    "fact_source": "from {source}",
    "fact_became": "became {became:, }",
    "status_waiting": "waiting to be processed",
    "status_processed": "processed",
    "show_title": "MESSAGE {n}",
    "show_sub": "{status}[ · {age}][ · from {source}]",
    "show_parts": "what it became",
    "show_part": "  «{excerpt}»\n    became {became:, }",
    "show_questions": "questions about it",
    "show_question": "  question {n}: {text}[ → {answer}]",
    "cmd_process": 'journal messages process {n} --part="<words>" --became=<ref>',
    "cmd_process_what": "record one part and what it became",
    "cmd_ask": 'journal questions add "<question>" --about="inbox {n}"',
    "cmd_ask_what": "a part you do not understand becomes a question",
    "cmd_done": "journal messages done {n}",
    "cmd_done_what": "mark it processed once every part is recorded",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def parse_became(text: str) -> tuple[str | None, str]:
    word = " ".join((text or "").split()).lower()
    if word in PLAIN:
        return word, ""
    m = _REF.match(text or "")
    if not m:
        return None, say("not_a_ref", text=repr(text))
    kind = m.group(1).lower().replace("-", "").rstrip("s")
    return f"{kind}:{int(m.group(2))}", ""


def label(ref: str) -> str:
    if ref in PLAIN:
        return say("plain_" + ref)
    kind, _, num = ref.partition(":")
    return say("label", kind=KINDS.get(kind, kind), n=num)


def sources(root: Path, ref: str, track: str | None = None) -> list[dict]:
    """The messages a part of which became `ref` (like `todo:44`), each with the words it quoted."""
    out = []
    for n, m in enumerate(_all(root, track), 1):
        parts = [p for p in m.get("parts") or [] if ref in p.get("became") or []]
        if parts:
            out.append({"n": n, "excerpt": parts[0].get("excerpt", "")})
    return out


def check_became(root: Path, ref: str, track: str | None = None) -> str | None:
    if ref in PLAIN:
        return None
    kind, _, num = ref.partition(":")
    n = int(num)
    track = track or state.current_track(root)
    if kind == "todo":
        import todo
        return None if todo.item(root, track, n)[0] else say("no_entry", kind=KINDS[kind], n=n)
    if kind in ("pin", "rule"):
        import pins
        count = len(pins._all(root, pins.RULES if kind == "rule" else pins.KEY, track))
    elif kind == "reminder":
        import reminders
        count = len(reminders._all(root, track))
    else:
        import questions
        count = len(questions._all(root, track))
    return None if 1 <= n <= count else say("no_entry", kind=KINDS[kind], n=n)


def _all(root: Path, track: str | None = None) -> list[dict]:
    got = state.tracked(root, KEY, track, []) if track else state.get(root, KEY, [])
    return got if isinstance(got, list) else []


def _put(root: Path, items: list[dict], track: str | None = None) -> None:
    if track:
        state.put_tracked(root, KEY, track, items)
    else:
        state.put(root, KEY, items)


def unprocessed(root: Path, track: str | None = None) -> list[tuple[int, dict]]:
    return [(n, m) for n, m in enumerate(_all(root, track), 1) if not m.get("processed")]


def _find(items: list[dict], n: int) -> tuple[dict | None, str]:
    if n < 1 or n > len(items):
        return None, say("no_such", n=n)
    return items[n - 1], ""


def _flat(text: str) -> str:
    return " ".join((text or "").split()).lower()


def _became(m: dict) -> list[str]:
    return list(dict.fromkeys(label(r) for p in m.get("parts") or [] for r in p["became"]))


def add(root: Path, text: str, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "source": source, "parts": [], "processed": None})
        _put(root, items, track)
        n = len(items)
    return True, say("added", n=n, waiting=len(unprocessed(root, track)))


def process(root: Path, n: int, excerpt: str, became: list[str], at: str,
            track: str | None = None) -> tuple[bool, str]:
    excerpt = " ".join((excerpt or "").split())
    if not excerpt:
        return False, say("needs_part", n=n)
    if not became:
        return False, say("needs_became")
    with state.locked(root):
        items = _all(root, track)
        m, why = _find(items, n)
        if m is None:
            return False, why
        if m.get("processed"):
            return False, say("already_processed", n=n)
        if _flat(excerpt) not in _flat(m["text"]):
            return False, say("not_in_message", n=n)
        refs: list[str] = []
        for raw in became:
            ref, why = parse_became(raw)
            if ref is None:
                return False, why
            why = check_became(root, ref, track)
            if why:
                return False, why
            if ref not in refs:
                refs.append(ref)
        m.setdefault("parts", []).append({"excerpt": excerpt, "became": refs, "at": at})
        _put(root, items, track)
        parts = len(m["parts"])
    return True, say("part_recorded", n=n, excerpt=fmt.gist(excerpt, 60), became=[label(r) for r in refs],
                     parts=parts)


def done(root: Path, n: int, at: str, track: str | None = None) -> tuple[bool, str]:
    with state.locked(root):
        items = _all(root, track)
        m, why = _find(items, n)
        if m is None:
            return False, why
        if m.get("processed"):
            return False, say("already_processed", n=n)
        if not m.get("parts"):
            return False, say("no_parts", n=n)
        m["processed"] = at
        _put(root, items, track)
    return True, say("done", n=n, became=_became(m), waiting=len(unprocessed(root, track)))


def update(root: Path, n: int, text: str, track: str | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    with state.locked(root):
        items = _all(root, track)
        m, why = _find(items, n)
        if m is None:
            return False, why
        if m.get("processed"):
            return False, say("already_processed", n=n)
        m["text"] = text
        _put(root, items, track)
    return True, say("edited", n=n)


def move(root: Path, n: int, dst: str, at: str, track: str | None = None) -> tuple[bool, str]:
    """Carry a waiting message to another environment: closed here as moved, waiting there."""
    import tracks
    dst = state.slug(dst)
    if not dst:
        return False, say("move_where", n=n)
    if dst not in tracks._all(root):
        return False, say("move_none", dst=repr(dst))
    here = track or state.current_track(root)
    if dst == here:
        return False, say("move_same", n=n, env=dst)
    with state.locked(root):
        items = _all(root, here)
        m, why = _find(items, n)
        if m is None:
            return False, why
        if m.get("processed"):
            return False, say("already_processed", n=n)
        there = _all(root, dst)
        there.append({**m, "processed": None, "moved_from": here})
        _put(root, there, dst)
        m["processed"], m["moved_to"] = at, f"{dst}:{len(there)}"
        _put(root, items, here)
    return True, say("moved", n=n, env=dst, there=len(there))


def _facts(m: dict) -> list[str]:
    if m.get("moved_to"):
        out = [say("fact_moved", to=m["moved_to"].replace(":", " message "))]
    else:
        out = [say("fact_processed", age=age(m["processed"])) if m.get("processed") else say("fact_waiting")]
    if age(m.get("at", "")):
        out.append(age(m["at"]))
    if m.get("source") and m["source"] != "cli":
        out.append(say("fact_source", source=m["source"]))
    became = _became(m)
    if became:
        out.append(say("fact_became", became=became))
    return out


def _ordered(root: Path, order: str, track: str | None = None) -> list[tuple[int, dict]]:
    sign = -1 if order == fmt.DESC else 1
    return sorted(enumerate(_all(root, track), 1),
                  key=lambda p: (1 if p[1].get("processed") else 0, sign * p[0]))


def listing(root: Path, *, cap: int | None = None, page: int = 1, order: str = fmt.DESC,
            track: str | None = None):
    import entries
    return entries.listing(_ordered(root, order, track), lambda p: fmt.Item(
        n=p[0], text=fmt.gist(p[1]["text"]), meta=" · ".join(_facts(p[1]))), cap=cap, page=page, order=fmt.ASC)


def show(root: Path, n: int, track: str | None = None) -> tuple[bool, str]:
    m, why = _find(_all(root, track), n)
    if m is None:
        return False, why
    return True, show_text(detail(root, n, m, track))


def detail(root: Path, n: int, m: dict, track: str | None = None) -> dict:
    import questions
    return {**row_response(n, m),
            "questions": [questions.row_response(qn, q) for qn, q in questions.about(root, f"inbox:{n}", track)]}


def show_text(d: dict) -> str:
    """A message's `detail` as the terminal page."""
    n = d["n"]
    status = say("status_waiting" if d["status"] == "waiting" else "status_processed")
    out = [fmt.title(say("show_title", n=n), sub=say("show_sub", status=status, age=d["age"],
                                                     source=d["source"] if d["source"] not in ("", "cli") else None)),
           "", fmt.wrap(d["text"])]
    if d["parts"]:
        out.append(fmt.section(say("show_parts")))
        out += [say("show_part", excerpt=p["excerpt"], became=[b["label"] for b in p["became"]]) for p in d["parts"]]
    if d["questions"]:
        out.append(fmt.section(say("show_questions")))
        out += [say("show_question", n=q["n"], text=q["text"], answer=q["answer"] or None) for q in d["questions"]]
    if d["status"] == "waiting":
        out += ["", fmt.commands([(say("cmd_process", n=n), say("cmd_process_what")),
                                  (say("cmd_ask", n=n), say("cmd_ask_what")),
                                  (say("cmd_done", n=n), say("cmd_done_what"))])]
    return "\n".join(out)


def row_response(n: int, m: dict) -> dict:
    return {
        "n": n, "text": m["text"], "gist": fmt.gist(m["text"]), "facts": " · ".join(_facts(m)),
        "status": "moved" if m.get("moved_to") else "processed" if m.get("processed") else "waiting",
        "moved_to": m.get("moved_to") or "",
        "age": age(m.get("at", "")), "processed_age": age(m.get("processed") or ""),
        "source": m.get("source") or "",
        "parts": [{"excerpt": p["excerpt"], "became": [{"ref": r, "label": label(r)} for r in p["became"]]}
                  for p in m.get("parts") or []],
    }


def rows_response(root: Path, track: str | None = None) -> list[dict]:
    return [row_response(n, m) for n, m in _ordered(root, fmt.DESC, track)]
