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
    "fact_reading": "being handled",
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
    "reply_what": 'say the reply: journal messages reply {n} "<what you did, or what you decided>"',
    "replied": "replied to message {n}; the user reads it under the message in the viewer",
    "show_replies": "replies",
    "show_reply": "  {who} · {age}\n    {text}",
    "reply_agent": "the agent",
    "reply_user": "you",
    "archive_why": 'say why: journal messages archive {n} "<why it needs nothing more>"',
    "already_archived": "message {n} is already archived",
    "archived": "message {n} is archived: {why}\n  it is off the list; `journal messages --all` still shows it",
    "fact_archived": "archived: {why}",
    "files_too_large": "the attached files come to {size} MB; a message holds at most {limit} MB",
    "file_unreadable": "cannot read {name}",
    "unfiled": "message {n} still holds {names:, }. File each one first: "
               'journal messages file {n} <name> "doc <doc>" — or keep it where it is: journal messages file {n} <name> keep',
    "no_file": "message {n} holds no file called {name}",
    "already_filed": "{name} of message {n} is already filed: {filed}",
    "file_where": 'say where it goes: journal messages file {n} {name} "doc <doc>" — or keep',
    "filed_doc": "{name} of message {n} is filed into doc {doc}\n  {path}",
    "filed_kept": "{name} of message {n} is kept where it is\n  {path}",
    "detach_why": 'say why it is removed: journal messages detach {n} {name} "<why>"',
    "detach_in_doc": "{name} of message {n} is filed into doc {doc}; remove it there: journal docs detach {doc} {name} \"<why>\"",
    "already_removed": "{name} of message {n} is already removed: {why}",
    "detached": "{name} is removed from message {n}: {why}\n  kept at {path}",
    "filed_label_removed": "removed: {why}",
    "attach_what": "name at least one file to add: journal messages attach {n} --file=<path>",
    "attached": "added {names:, } to message {n}",
    "filed_label_doc": "filed into doc {doc}",
    "filed_label_kept": "kept",
    "filed_label_none": "not filed yet",
    "fact_files": "{n} file(s)",
    "show_files": "files",
    "show_file": "  {name}  ({status})\n    {path}",
    "cmd_file": 'journal messages file {n} <name> "doc <doc>"',
    "cmd_file_what": "file an attachment into a doc, or `keep` it where it is",
    "attached_title": "from the user's message {n}",
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
    return [(n, m) for n, m in enumerate(_all(root, track), 1) if not m.get("processed") and not m.get("archived")]


def _find(items: list[dict], n: int) -> tuple[dict | None, str]:
    if n < 1 or n > len(items):
        return None, say("no_such", n=n)
    return items[n - 1], ""


def _flat(text: str) -> str:
    return " ".join((text or "").split()).lower()


def _became(m: dict) -> list[str]:
    return list(dict.fromkeys(label(r) for p in m.get("parts") or [] for r in p["became"]))


FILES = "inbox-files"
FILES_LIMIT = 20 * 1024 * 1024


def files_dir(root: Path, track: str | None, n: int) -> Path:
    return state.env_dir(root, track or state.current_track(root)) / FILES / str(n)


def _file_name(name: str, taken: set) -> str:
    base = Path(str(name or "").replace("\\", "/")).name.strip().lstrip(".") or "file"
    stem, dot, ext = base.rpartition(".")
    got, i = base, 2
    while got in taken:
        got = f"{stem}-{i}.{ext}" if dot and stem else f"{base}-{i}"
        i += 1
    taken.add(got)
    return got


def _read_files(files: list | None) -> tuple[list[tuple[str, bytes]], str]:
    import base64
    out, taken = [], set()
    for f in files or []:
        if not isinstance(f, dict):
            continue
        name = f.get("name") or (Path(f["path"]).name if f.get("path") else "")
        try:
            if f.get("path"):
                data = Path(f["path"]).expanduser().read_bytes()
            else:
                raw = str(f.get("data") or "")
                data = base64.b64decode(raw.split(",", 1)[1] if raw.startswith("data:") else raw, validate=False)
        except (OSError, ValueError):
            return [], say("file_unreadable", name=repr(name))
        out.append((_file_name(name, taken), data))
    size = sum(len(d) for _, d in out)
    if size > FILES_LIMIT:
        return [], say("files_too_large", size=round(size / 1048576, 1), limit=FILES_LIMIT // 1048576)
    return out, ""


def add(root: Path, text: str, at: str, source: str = "cli", track: str | None = None,
        files: list | None = None) -> tuple[bool, str]:
    text = (text or "").strip()
    if not text:
        return False, say("needs_text")
    got, why = _read_files(files)
    if why:
        return False, why
    with state.locked(root):
        items = _all(root, track)
        items.append({"text": text, "at": at, "source": source, "parts": [], "processed": None,
                      **({"files": [{"name": name, "size": len(data), "filed": None} for name, data in got]} if got else {})})
        _put(root, items, track)
        n = len(items)
        if got:
            held = files_dir(root, track, n)
            held.mkdir(parents=True, exist_ok=True)
            for name, data in got:
                (held / name).write_bytes(data)
    return True, say("added", n=n, waiting=len(unprocessed(root, track)))


def unfiled(m: dict) -> list[str]:
    return [f["name"] for f in m.get("files") or [] if not f.get("filed") and not f.get("removed")]


def detach(root: Path, n: int, name: str, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    """Take a held file off a message: it moves to a struck folder beside the others, and the message keeps why."""
    why = " ".join((why or "").split())
    if not why:
        return False, say("detach_why", n=n, name=name)
    here = track or state.current_track(root)
    with state.locked(root):
        items = _all(root, here)
        m, err = _find(items, n)
        if m is None:
            return False, err
        f = next((x for x in m.get("files") or [] if x["name"] == name), None)
        if f is None:
            return False, say("no_file", n=n, name=repr(name))
        if f.get("removed"):
            return False, say("already_removed", n=n, name=name, why=f["removed"])
        if str(f.get("filed") or "").startswith("doc:"):
            return False, say("detach_in_doc", n=n, name=name, doc=f["filed"][4:])
        held = files_dir(root, here, n)
        struck = held / "struck"
        struck.mkdir(parents=True, exist_ok=True)
        dst = struck / _file_name(name, {p.name for p in struck.iterdir()})
        if (held / name).exists():
            (held / name).rename(dst)
        f["removed"], f["removed_at"] = why, at
        _put(root, items, here)
    return True, say("detached", n=n, name=name, why=why, path=dst.relative_to(root.parent))


def attach(root: Path, n: int, files: list | None, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """Add files to a message already sent. From the viewer, the addition is a comment on the message, so the agent is told."""
    if not files:
        return False, say("attach_what", n=n)
    got, why = _read_files(files)
    if why:
        return False, why
    here = track or state.current_track(root)
    with state.locked(root):
        items = _all(root, here)
        m, err = _find(items, n)
        if m is None:
            return False, err
        taken = {f["name"] for f in m.get("files") or []}
        held = files_dir(root, here, n)
        held.mkdir(parents=True, exist_ok=True)
        names = []
        for name, data in got:
            name = _file_name(name, taken)
            (held / name).write_bytes(data)
            m.setdefault("files", []).append({"name": name, "size": len(data), "filed": None, "added_at": at})
            names.append(name)
        _put(root, items, here)
    if source == "web":
        import comments
        comments.add(root, f"message {n}", say("attached", n=n, names=names), at, source="web", track=here)
    return True, say("attached", n=n, names=names)


def file_into(root: Path, n: int, name: str, into: str, at: str, track: str | None = None) -> tuple[bool, str]:
    """File one held attachment: into a doc (copied there, the held copy removed), or kept where it is."""
    import re as _re
    here = track or state.current_track(root)
    where = " ".join((into or "").split())
    keep = where.lower() == "keep"
    doc_ref = _re.match(r"^docs?\s*[:#\s]?\s*(.+)$", where, _re.I)
    if not keep and not doc_ref:
        return False, say("file_where", n=n, name=name)
    with state.locked(root):
        items = _all(root, here)
        m, why = _find(items, n)
        if m is None:
            return False, why
        f = next((x for x in m.get("files") or [] if x["name"] == name), None)
        if f is None:
            return False, say("no_file", n=n, name=repr(name))
        if f.get("filed"):
            return False, say("already_filed", n=n, name=name, filed=f["filed"])
        path = files_dir(root, here, n) / name
        shown = path.relative_to(root.parent)
        if keep:
            f["filed"] = "kept"
            _put(root, items, here)
            return True, say("filed_kept", n=n, name=name, path=shown)
    import docs
    ok, message = docs.attach(root, doc_ref.group(1), str(path), say("attached_title", n=n), here, source="the user")
    if not ok:
        return False, message
    doc, _, _ = docs.get(root, doc_ref.group(1))
    path.unlink(missing_ok=True)
    with state.locked(root):
        items = _all(root, here)
        m, _ = _find(items, n)
        f = next(x for x in m["files"] if x["name"] == name)
        f["filed"] = f"doc:{doc['n']}"
        _put(root, items, here)
    return True, say("filed_doc", n=n, name=name, doc=doc["n"], path=(doc["dir"] / docs.FILES / name).relative_to(root.parent))


def _filed_label(f: dict) -> str:
    if f.get("removed"):
        return say("filed_label_removed", why=f["removed"])
    filed = f.get("filed") or ""
    if filed.startswith("doc:"):
        return say("filed_label_doc", doc=filed[4:])
    return say("filed_label_kept") if filed == "kept" else say("filed_label_none")


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
        if unfiled(m):
            return False, say("unfiled", n=n, names=unfiled(m))
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
        held = files_dir(root, here, n)
        if held.is_dir():
            import shutil
            files_dir(root, dst, len(there)).parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(held), str(files_dir(root, dst, len(there))))
        m["processed"], m["moved_to"] = at, f"{dst}:{len(there)}"
        _put(root, items, here)
    return True, say("moved", n=n, env=dst, there=len(there))


def reply(root: Path, n: int, text: str, at: str, source: str = "cli", track: str | None = None) -> tuple[bool, str]:
    """A short answer under a message: what was done, a clarification, a call the agent made. Any status."""
    text = (text or "").strip()
    if not text:
        return False, say("reply_what", n=n)
    with state.locked(root):
        items = _all(root, track)
        m, err = _find(items, n)
        if m is None:
            return False, err
        m.setdefault("replies", []).append({"text": text, "at": at, "source": source})
        _put(root, items, track)
    return True, say("replied", n=n)


def mark_read(root: Path, numbers: list[int], at: str, track: str | None = None) -> None:
    """The agent has read these waiting messages: the viewer shows them as being handled until they are processed."""
    with state.locked(root):
        items = _all(root, track)
        changed = False
        for n in numbers:
            m, _ = _find(items, n)
            if m is not None and not m.get("processed") and not m.get("archived") and not m.get("read"):
                m["read"], changed = at, True
        if changed:
            _put(root, items, track)


def archive(root: Path, n: int, why: str, at: str, track: str | None = None) -> tuple[bool, str]:
    """Take a message off the list, with the reason. A waiting one stops waiting; nothing is deleted."""
    why = " ".join((why or "").split())
    if not why:
        return False, say("archive_why", n=n)
    with state.locked(root):
        items = _all(root, track)
        m, err = _find(items, n)
        if m is None:
            return False, err
        if m.get("archived"):
            return False, say("already_archived", n=n)
        m["archived"], m["archived_at"] = why, at
        _put(root, items, track)
    return True, say("archived", n=n, why=why)


def _facts(m: dict) -> list[str]:
    if m.get("archived"):
        out = [say("fact_archived", why=m["archived"])]
    elif m.get("moved_to"):
        out = [say("fact_moved", to=m["moved_to"].replace(":", " message "))]
    else:
        out = [say("fact_processed", age=age(m["processed"])) if m.get("processed")
               else say("fact_reading") if m.get("read") else say("fact_waiting")]
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
    here = track or state.current_track(root)
    files = [{**f, "path": str((files_dir(root, here, n) / f["name"]).relative_to(root.parent))}
             for f in row_response(n, m)["files"]]
    return {**row_response(n, m), "files": files,
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
    if d.get("files"):
        out.append(fmt.section(say("show_files")))
        out += [say("show_file", name=f["name"], status=f["filed_label"], path=f["path"]) for f in d["files"]]
    if d.get("replies"):
        out.append(fmt.section(say("show_replies")))
        out += [say("show_reply", who=r["who"], age=r["age"] or "just now", text=r["text"]) for r in d["replies"]]
    if d["questions"]:
        out.append(fmt.section(say("show_questions")))
        out += [say("show_question", n=q["n"], text=q["text"], answer=q["answer"] or None) for q in d["questions"]]
    if d["status"] == "waiting":
        out += ["", fmt.commands([(say("cmd_process", n=n), say("cmd_process_what")),
                                  *([(say("cmd_file", n=n), say("cmd_file_what"))] if d.get("files") else []),
                                  (say("cmd_ask", n=n), say("cmd_ask_what")),
                                  (say("cmd_done", n=n), say("cmd_done_what"))])]
    return "\n".join(out)


def row_response(n: int, m: dict) -> dict:
    return {
        "n": n, "text": m["text"], "gist": fmt.gist(m["text"]), "facts": " · ".join(_facts(m)),
        "status": "archived" if m.get("archived") else "moved" if m.get("moved_to") else "processed" if m.get("processed") else "waiting",
        "archived": m.get("archived") or "",
        "closed_at": m.get("archived_at") or m.get("processed") or "",
        "replies": [{"text": r["text"], "at": r.get("at", ""), "age": age(r.get("at", "")) if r.get("at") else "",
                     "who": say("reply_user") if r.get("source") == "web" else say("reply_agent")}
                    for r in m.get("replies") or []],
        "moved_to": m.get("moved_to") or "",
        "read": m.get("read") or "", "read_age": age(m["read"]) if m.get("read") else "",
        "age": age(m.get("at", "")), "processed_age": age(m.get("processed") or ""),
        "source": m.get("source") or "",
        "files": [{"name": f["name"], "size": f.get("size", 0), "filed": f.get("filed") or "", "filed_label": _filed_label(f),
                   "removed": f.get("removed") or ""}
                  for f in m.get("files") or []],
        "parts": [{"excerpt": p["excerpt"], "became": [{"ref": r, "label": label(r)} for r in p["became"]]}
                  for p in m.get("parts") or []],
    }


def rows_response(root: Path, track: str | None = None) -> list[dict]:
    return [row_response(n, m) for n, m in _ordered(root, fmt.DESC, track)]
