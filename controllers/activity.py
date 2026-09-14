from __future__ import annotations

from pathlib import Path

from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "work_started": "Started work {n}",
    "work_note": "Noted progress on work {n}",
    "work_ended": "Ended work {n}",
    "todo_added": "Added to-do {n}",
    "todo_closed": "Closed to-do {n}",
    "question_asked": "Asked question {n}",
    "question_answered": "Answered question {n}",
    "message_left": "Left message {n}",
    "message_processed": "Processed message {n}",
}

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
        for stem, info in tracks.live(root).items():
            if info["track"] == env:
                return {"session": stem[:8], "seen": tracks.age_text(info["age"])}
        return None

    @staticmethod
    def _events(root: Path, env: str) -> list[dict]:
        import commandlog
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
            add(w.get("at"), "work", say("work_started", n=wn), wn, AGENT)
            for note in w.get("notes") or []:
                add(note.get("at"), "work", say("work_note", n=wn), wn, AGENT)
            add(w.get("ended"), "work", say("work_ended", n=wn), wn, AGENT)
        for t in todo._all(root, env):
            add(t.get("at"), "todo", say("todo_added", n=t["n"]), t["n"], AGENT if t.get("session") else USER)
            add(t.get("done"), "todo", say("todo_closed", n=t["n"]), t["n"], USER if t.get("closed_by") == "web" else AGENT)
        for n, q in enumerate(questions._all(root, env), 1):
            if q.get("removed"):
                continue
            add(q.get("at"), "question", say("question_asked", n=n), n, AGENT)
            add(q.get("answered_at"), "question", say("question_answered", n=n), n, USER)
        for n, m in enumerate(inbox._all(root, env), 1):
            if m.get("removed"):
                continue
            add(m.get("at"), "message", say("message_left", n=n), n, USER)
            add(m.get("processed"), "message", say("message_processed", n=n), n, AGENT)
        for c in commandlog.entries(root, env):
            add(c.get("at"), c.get("kind") or "command", c.get("text", ""), c.get("n"), AGENT)
        out.sort(key=lambda e: e["at"], reverse=True)
        return [{**e, "age": age(e["at"])} for e in out[:commandlog.setting(root, env, commandlog.SHOW)]]
