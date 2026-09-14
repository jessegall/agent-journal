from __future__ import annotations

from pathlib import Path

from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "work_started": "Started work: {subject}",
    "work_note": "{text}",
    "work_ended": "Ended work: {subject}",
    "todo_added": "Added to-do {n}: {title}",
    "todo_closed": "Closed to-do {n}: {title}",
    "question_asked": "Asked question {n}: {text}",
    "question_answered": "Answered question {n}",
    "message_left": "Left message {n}",
    "message_processed": "Processed message {n}",
}

LIMIT = 12
TEXT_MAX = 100
AGENT, USER = "Agent", "You"


def short(text: str) -> str:
    text = " ".join(text.split())
    if len(text) <= TEXT_MAX:
        return text
    cut = text[:TEXT_MAX - 1]
    return (cut.rsplit(" ", 1)[0] if " " in cut[TEXT_MAX // 2:] else cut) + "…"


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class ActivityController(Controller):
    """What is happening on an environment: the working agent's latest message, and the latest journal events."""
    resource = "activity"
    noun = "activity"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        return Result("ok", "", {"agent": self._agent(root, p.env), "events": self._events(root, p.env)})

    @staticmethod
    def _agent(root: Path, env: str) -> dict | None:
        import tracks
        import transcript
        for stem, info in tracks.live(root).items():
            if info["track"] != env:
                continue
            path = transcript.find(root.parent, stem)
            got = transcript.last_reply(path) if path else None
            return {"session": stem[:8], "seen": tracks.age_text(info["age"]), "text": got[0] if got else ""}
        return None

    @staticmethod
    def _events(root: Path, env: str) -> list[dict]:
        import inbox
        import questions
        import todo
        import work
        from pins import age
        out: list[dict] = []

        def add(at, kind: str, text: str, n: int | None, by: str) -> None:
            if at:
                out.append({"at": at, "kind": kind, "n": n, "text": short(text), "by": by})

        for wn, w in enumerate(work._all(root, env), 1):
            if w.get("removed"):
                continue
            add(w.get("at"), "work", say("work_started", subject=w["subject"]), wn, AGENT)
            for note in w.get("notes") or []:
                add(note.get("at"), "work", say("work_note", text=note.get("text", "")), wn, AGENT)
            add(w.get("ended"), "work", say("work_ended", subject=w["subject"]), wn, AGENT)
        for t in todo._all(root, env):
            title = t.get("title", "")
            add(t.get("at"), "todo", say("todo_added", n=t["n"], title=title), t["n"], AGENT if t.get("session") else USER)
            add(t.get("done"), "todo", say("todo_closed", n=t["n"], title=title), t["n"],
                USER if t.get("closed_by") == "web" else AGENT)
        for n, q in enumerate(questions._all(root, env), 1):
            if q.get("removed"):
                continue
            add(q.get("at"), "question", say("question_asked", n=n, text=q.get("text", "")), n, AGENT)
            add(q.get("answered_at"), "question", say("question_answered", n=n), n, USER)
        for n, m in enumerate(inbox._all(root, env), 1):
            if m.get("removed"):
                continue
            add(m.get("at"), "message", say("message_left", n=n), n, USER)
            add(m.get("processed"), "message", say("message_processed", n=n), n, AGENT)
        out.sort(key=lambda e: e["at"], reverse=True)
        return [{**e, "age": age(e["at"])} for e in out[:LIMIT]]
