from __future__ import annotations

from pathlib import Path

import tags
from controller import Controller, Payload, Result

#: how many turns the thread hands back at once, newest last
TURNS = 120

#: a turn's text is a bubble, not a document: longer than this and the thread reads as a wall
TEXT_MAX = 1200

#: what a chat shows rather than names: the viewer serves these from /message-files and draws them
PICTURES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg")


def trim(text: str, limit: int = TEXT_MAX) -> str:
    """The bubble's share of a turn. A cut one says so, and `full` carries the rest."""
    text = (text or "").strip()
    return text if len(text) <= limit else text[:limit].rstrip() + "…"


def said(root: Path, env: str) -> list[dict]:
    """What the agent SAID on this environment: its tagged replies, in the order it said them.

    WHAT IT SAID AND WHAT IT DID ARE TWO RECORDS, AND ONLY ONE OF THEM IS A CONVERSATION. Every edit,
    command and journal write is already in the command log, which is what the Activity column draws;
    none of it belongs here. The filter is not a heuristic over that log — it is a different source.
    A reply is a turn when it opens with a tag, and the tag is a field the agent already writes, so
    nothing has to be classified and a message that merely MENTIONS a tag is not one (`tags.found`
    matches the start of the message, never the start of a line).

    EVERY TRANSCRIPT, NOT THE LIVE ONE. This used to walk `tracks.live()`, which drops a session that
    has ended, one idle past a day, and one whose binding has moved — so the thread kept every message
    the user wrote and silently lost everything the agent said, because the user's half is JSON and the
    agent's was read live. A transcript does not stop existing when its session does, and it records
    which environment each stretch of it belonged to, so that is what is read.
    """
    import transcript
    # NOTHING SAID BEFORE THIS ENVIRONMENT EXISTED. The marks live in the transcripts, which this
    # package does not own and must never rewrite, so a NAME used again finds every stretch any
    # session ever spent on a name like it — the old environment's conversation, under a new one
    # that inherited nothing else. An environment knows when it was made; that is the boundary,
    # and it holds by construction rather than by remembering to clean something up. An
    # environment from before the registry recorded a time keeps all of its history, as it should.
    began = _began(root, env)
    out = []
    for path in transcript.sessions(root.parent):
        out.extend(t for t in _scan(path, env) if not began or _at(t["at"]) >= began)
    return out


def _at(stamp: str) -> float:
    from datetime import datetime
    try:
        return datetime.fromisoformat(str(stamp).replace("Z", "+00:00")).timestamp()
    except (TypeError, ValueError):
        return 0.0


def _began(root: Path, env: str) -> float:
    import tracks
    return _at((tracks._all(root).get(env) or {}).get("at") or "")


#: path -> {"size": bytes already read, "turns": every turn found in them, "here": the environment
#: those bytes ended on}. Kept per FILE, so a transcript whose session has ended is read once and never
#: again, and a live one is read only from where the last read stopped.
_READ: dict = {}


def _text_of(rec: dict) -> str:
    """Whatever text a record carries, for matching the marks that say which environment it is on.

    The start block is not in the message at all: a SessionStart hook's output arrives under
    `attachment.stdout`, and a switch's under `toolUseResult`. Reading only `message.content` found
    neither, and every turn in every transcript filed itself under the environment that comes before
    any mark.
    """
    parts = []
    content = (rec.get("message") or {}).get("content")
    if isinstance(content, str):
        parts.append(content)
    elif isinstance(content, list):
        parts.extend(str(b.get("text") or b.get("content") or "") for b in content if isinstance(b, dict))
    for key in ("toolUseResult", "attachment"):
        got = rec.get(key)
        if isinstance(got, dict):
            parts.extend(str(got.get(f) or "") for f in ("stdout", "content", "text"))
        elif isinstance(got, str):
            parts.append(got)
    return " ".join(p for p in parts if p)


def _spoken(rec: dict) -> str:
    """The assistant's own words in this record, and nothing it called."""
    content = (rec.get("message") or {}).get("content")
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    return "".join(b.get("text") or "" for b in content
                   if isinstance(b, dict) and b.get("type") == "text")


def _scan(path, env: str) -> list[dict]:
    """This transcript's tagged turns for `env`, parsing only the bytes appended since the last read.

    The whole file is parsed the first time and never again: a record is small, and reading 317MB of
    them across sixteen transcripts measured 0.87s, which is a price worth paying once per file rather
    than a prefilter that is fast and sometimes wrong about where an environment began.
    """
    import transcript
    try:
        size = path.stat().st_size
    except OSError:
        return []
    held = _READ.get(str(path))
    # a transcript that SHRANK was replaced, not appended to: read it again from the start
    if held is None or held["size"] > size:
        held = {"size": 0, "turns": [], "here": transcript._BEFORE_TRACKS}
    if held["size"] < size:
        with path.open("rb") as fh:
            fh.seek(held["size"])
            data = fh.read(size - held["size"])
        # stop at the last complete record: the one still being written is parsed on the next read
        cut = data.rfind(b"\n") + 1
        for raw in data[:cut].splitlines():
            _take(raw, held)
        held["size"] += cut
        _READ[str(path)] = held
    return [t for t in held["turns"] if t["env"] == env]


def _take(raw: bytes, held: dict) -> None:
    import json
    import transcript
    raw = raw.strip()
    if not raw:
        return
    try:
        rec = json.loads(raw)
    except ValueError:
        return
    if not isinstance(rec, dict):
        return
    if rec.get("type") == "assistant":
        text = _spoken(rec)
        got = tags.found(text)
        if got:
            whole = tags.strip(text)
            held["turns"].append({"at": rec.get("timestamp") or "", "who": "agent", "kind": "said",
                                  "tag": got[0], "text": trim(whole), "n": None, "ref": "",
                                  "full": whole if len(whole.strip()) > TEXT_MAX else "",
                                  "env": held["here"]})
        # an assistant message is never a mark: it can only ever be QUOTING one
        return
    said = _text_of(rec)
    m = transcript._START_MARK.search(said) or transcript._SWITCH_MARK.search(said)
    if m:
        held["here"] = m.group(1)


def wrote(root: Path, env: str) -> list[dict]:
    """What the user wrote, and what was said back under it: the messages and their replies.

    Both halves come from the inbox, which is already the record of everything sent from the viewer
    and answered from the terminal — so a thread is a reading of what is there, not a second store
    that has to be kept level with it.
    """
    import inbox
    import todo
    # WHAT A MESSAGE BECAME IS ALREADY WRITTEN DOWN, and so is whether that row is being worked: a part
    # records its ref, a to-do carries `started` until it is `done`. So the header is three reads of
    # what is there — it POINTS at the work, it does not report it, which is the Activity column's job.
    rows = {t["n"]: t for t in todo._all(root, env)}
    out = []
    for n, m in enumerate(inbox._all(root, env), 1):
        if m.get("archived"):
            continue
        became = inbox._became(m)
        made = [int(ref.partition(":")[2]) for p in m.get("parts") or [] for ref in p.get("became") or []
                if str(ref).startswith("todo:") and ref.partition(":")[2].isdigit()]
        working = any((rows.get(k) or {}).get("started") and not (rows.get(k) or {}).get("done") for k in made)
        whole = (m.get("text") or "").strip()
        out.append({"at": m.get("at") or "", "who": "you", "kind": "message", "tag": "",
                    "text": trim(whole), "full": whole if len(whole) > TEXT_MAX else "", "n": n,
                    "ref": "",
                    "files": [{"name": f["name"], "picture": f["name"].lower().endswith(PICTURES)}
                              for f in (m.get("files") or []) if not f.get("removed")],
                    # delivered, read, filed: three states the record already keeps, so the ticks are a
                    # reading of what is there rather than a fourth thing to keep level with it
                    "state": "filed" if m.get("processed") else "read" if m.get("read") else "sent",
                    "became": ", ".join(became),
                    # the refs themselves, not only their words: the viewer makes each one a link, and
                    # a label joined into a sentence cannot be followed
                    "became_refs": [{"ref": ref, "label": inbox.label(ref)} for ref in dict.fromkeys(
                        ref for p in m.get("parts") or [] for ref in p.get("became") or [] if ":" in str(ref))],
                    "working": working})
        # EITHER A NOTE OR AN ANSWER, NEVER BOTH. A message that produced rows and no reply gets the
        # journal's own acknowledgement — a line, not a bubble. The moment the agent says something
        # about it in its own words, that IS the acknowledgement and the note is gone. It is read
        # off the record here rather than written into it, so the order the two arrive in cannot
        # leave one of each standing.
        # A NOTE SAYS WHICH MESSAGE IT IS FOR, so a run of them is not a column of "Noted" with
        # nothing tying any of them to what produced it. A message that made no row gets none: an
        # acknowledgement that reports nothing acknowledges nothing.
        made = [b for b in became if b and b != "noted"]
        if m.get("processed") and made and not any(
                (r.get("source") or "") not in ("web", "journal") for r in m.get("replies") or []):
            out.append({"at": m.get("processed") or m.get("at") or "", "who": "agent", "kind": "receipt",
                        "tag": "", "text": inbox.say("receipt", became=made), "n": n,
                        "ref": trim(whole, 90)})
        for r in m.get("replies") or []:
            if (r.get("source") or "") == "journal":
                continue
            out.append({"at": r.get("at") or "", "who": "you" if r.get("source") == "web" else "agent",
                        "kind": "reply",
                        "tag": "", "text": trim(r.get("text") or ""),
                        "full": (r.get("text") or "").strip() if len((r.get("text") or "").strip()) > TEXT_MAX else "",
                        "n": n,
                        # the two point opposite ways and never both appear: part is the user's words the
                        # agent answered, quoting is the thread's words the user answered. A reply that
                        # named neither quoted nothing at all, so in the thread it read as a turn the
                        # agent happened to take — the one thing it is not. It answers the message, so
                        # it says the message.
                        "ref": (r.get("quoting") or r.get("part")
                                or (trim(whole, 90) if r.get("source") != "web" else ""))})
    return out


def asked(root: Path, env: str) -> list[dict]:
    """The questions the agent asked, and the answers given: a question is a turn like any other.

    A QUESTION IS THE ONE THING THE USER MUST ANSWER, and it used to live only on a card away from
    the conversation that raised it. It travels with the whole question on it, not just its words, so
    the thread can offer the same answering the question's own page does rather than a second one
    that drifts from it.
    """
    import questions
    out = []
    for n, q in enumerate(questions._all(root, env), 1):
        if q.get("withdrawn"):
            continue
        row = questions.row_response(n, q)
        out.append({"at": q.get("at") or "", "who": "agent", "kind": "question", "tag": "",
                    "text": trim(q.get("text") or ""), "n": n, "ref": "", "question": row})
        if q.get("answer"):
            out.append({"at": q.get("answered_at") or q.get("at") or "", "who": "you", "kind": "answer",
                        "tag": "", "text": trim(q.get("answer")), "n": n, "ref": trim(q.get("text") or "", 120)})
    return out


def waited(root: Path, env: str) -> list[dict]:
    """Work the agent set aside because it is waiting on the user: a turn, with the ask on it.

    PARKING IS THE AGENT SAYING IT CANNOT GO ON WITHOUT YOU, and until now it said it where
    nobody was looking: parked work is filtered out of the home's open-work list, so "the PR is
    ready, do you want to merge it?" sat in the record and the thread carried on without it.

    It is a turn rather than a card because it IS one — the agent said something and is waiting
    for an answer, which is the shape of every other turn here. Answering it is a reply on the
    turn, which is a message, which is the one kind that reaches a working session at once.
    """
    import work
    out = []
    for w in work.open_work(root, env):
        got = work.parked(w)
        if not got:
            continue
        why = (got.get("why") or "").strip()
        out.append({"at": got.get("at") or w.get("at") or "", "who": "agent", "kind": "parked", "tag": "",
                    "text": trim(why), "full": why if len(why) > TEXT_MAX else "", "n": None,
                    "ref": w.get("subject") or ""})
    return out


class ChatController(Controller):
    """The conversation on an environment: what the agent said and what the user said back, and nothing else."""
    resource = "chat"
    noun = "chat"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        turns = said(root, p.env) + wrote(root, p.env) + asked(root, p.env) + waited(root, p.env)
        turns.sort(key=lambda t: t["at"])
        left = max(0, len(turns) - TURNS)
        return Result("ok", "", {"turns": turns[left:], "more": left})
