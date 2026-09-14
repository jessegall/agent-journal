from __future__ import annotations

from pathlib import Path

from controller import Controller, Payload, Result
from templates import render

MESSAGES = {
    "work_started": "Started work",
    "work_note": "Updated work",
    "work_ended": "Ended work",
    "todo_added": "Added to-do",
    "todo_closed": "Closed to-do",
    "question_asked": "Asked question",
    "question_answered": "Answered question",
    "message_left": "Wrote message",
    "message_processed": "Processed message",
    "suggestion_made": "Suggested a change",
}

TEXT_MAX = 100
TITLE_MAX = 200
AGENT, USER = "Agent", "You"


def short(text: str, limit: int = TEXT_MAX) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit - 1]
    return (cut.rsplit(" ", 1)[0] if " " in cut[limit // 2:] else cut) + "…"


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

        def numbered(items, field: str) -> dict:
            return {i: x.get(field, "") for i, x in enumerate(items, 1) if isinstance(x, dict)}

        # kind -> {number: title}, built only for the kinds that appear
        lookups = {
            "todo": lambda: {t["n"]: t.get("title", "") for t in todo._all(root, env)},
            "message": lambda: numbered(inbox._all(root, env), "text"),
            "question": lambda: numbered(questions._all(root, env), "text"),
            "work": lambda: numbered(work._all(root, env), "subject"),
            "report": lambda: numbered(__import__("reports")._all(root, env), "title"),
            "suggestion": lambda: numbered(__import__("suggestions")._all(root, env), "title"),
            "reminder": lambda: numbered(__import__("reminders")._all(root, env), "text"),
            "pin": lambda: numbered(__import__("pins")._all(root, track=env), "fact"),
            "rule": lambda: numbered(__import__("pins")._all(root, "rules"), "fact"),
            "doc": lambda: {d["n"]: d.get("title", "") for d in __import__("docs").all_docs(root)},
        }
        titles: dict[str, dict] = {}

        def title_of(kind: str, n) -> str:
            if not str(n or "").isdigit() or kind not in lookups:
                return ""
            if kind not in titles:
                titles[kind] = lookups[kind]()
            return short(titles[kind].get(int(n), "") or "", TITLE_MAX)

        def add(at, kind: str, text: str, n: int | None, by: str, titled: bool = False, needs: str = "") -> None:
            """`needs`: "open" when the line waits on the user, "answered" once they have answered it."""
            if at:
                out.append({"at": at, "kind": kind, "n": n, "text": short(text),
                            "title": title_of(kind, n) if titled else "", "by": by, "needs": needs})

        for wn, w in enumerate(work._all(root, env), 1):
            if w.get("removed"):
                continue
            add(w.get("at"), "work", say("work_started"), wn, AGENT, True)
            for note in w.get("notes") or []:
                add(note.get("at"), "work", say("work_note"), wn, AGENT)
            add(w.get("ended"), "work", say("work_ended"), wn, AGENT)
        for t in todo._all(root, env):
            add(t.get("at"), "todo", say("todo_added"), t["n"], AGENT if t.get("session") else USER, True)
            add(t.get("done"), "todo", say("todo_closed"), t["n"], USER if t.get("closed_by") == "web" else AGENT)
        for n, q in enumerate(questions._all(root, env), 1):
            if q.get("removed"):
                continue
            waiting = not q.get("answered_at") and not q.get("withdrawn") and not q.get("withdrawn_at")
            add(q.get("at"), "question", say("question_asked"), n, AGENT, True, "open" if waiting else "")
            add(q.get("answered_at"), "question", say("question_answered"), n, USER, needs="answered")
        suggestions = __import__("suggestions")
        for n, s in enumerate(suggestions._all(root, env), 1):
            if not isinstance(s, dict) or s.get("removed"):
                continue
            add(s.get("at"), "suggestion", say("suggestion_made"), n, AGENT, True,
                "open" if suggestions.status(s) == "open" else "")
        for n, m in enumerate(inbox._all(root, env), 1):
            if m.get("removed"):
                continue
            add(m.get("at"), "message", say("message_left"), n, USER, True)
            add(m.get("processed"), "message", say("message_processed"), n, AGENT)
        for c in commandlog.entries(root, env):
            add(c.get("at"), c.get("kind") or "command", c.get("text", ""), c.get("n"), AGENT, c.get("titled", False))
        out.sort(key=lambda e: e["at"], reverse=True)
        return [{**e, "age": age(e["at"])} for e in out[:commandlog.setting(root, env, commandlog.SHOW)]]
