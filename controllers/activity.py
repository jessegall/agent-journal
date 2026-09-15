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
    "message_processed": "Filed message",
    "message_answered": "Answered your question",
    "suggestion_made": "Suggested a change",
    "comment_written": "Wrote comment",
    "comment_handled": "Handled comment",
}

TEXT_MAX = 100
TITLE_MAX = 200
AGENT, USER = "Agent", "You"


BECAME = {"todo": "to-do", "question": "question", "pin": "pin", "rule": "rule", "reminder": "reminder", "doc": "document"}


def became(message: dict) -> str:
    """What a filed message's parts became, like "to-do 139, question 12"."""
    out = []
    for part in message.get("parts") or []:
        for ref in part.get("became") or []:
            kind, _, n = str(ref).partition(":")
            label = f"{BECAME[kind]} {n}" if kind in BECAME and n else ("work update" if kind == "work" else kind)
            if label and label not in out:
                out.append(label)
    return ", ".join(out)


def short(text: str, limit: int = TEXT_MAX) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit - 1]
    return (cut.rsplit(" ", 1)[0] if " " in cut[limit // 2:] else cut) + "…"


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


def agent_working(root: Path, stem: str) -> bool:
    """Is the session busy right now? Its last hook event says: a Stop means it is waiting for the user.
    A long tool call fires nothing until it ends, so its last event stays the PreToolUse that started it."""
    import state
    return state.get(root, "last_event", "", stem=stem) not in ("Stop", "")


def agent_compacting(root: Path, stem: str) -> bool:
    """Is the session compacting its context? PreCompact is its last event until the SessionStart that follows."""
    import state
    return state.get(root, "last_event", "", stem=stem) == "PreCompact"


def context_use(path: Path | None, window: int) -> dict | None:
    """How full the session's context is, or None when the window or the reading is unknown."""
    import context
    used = context.reading_tail(path) if path and window else None
    if used is None:
        return None
    return {"used": used, "window": window, "share": min(100, round(used * 100 / window))}


#: path -> (file size, text): the column polls every few seconds, and the transcript only grows
_SAID: dict = {}


def session_started(path) -> str:
    # the transcript is created when the session starts, so its birth time is the session's start
    if not path:
        return ""
    try:
        st = Path(path).stat()
    except OSError:
        return ""
    from datetime import datetime, timezone
    born = getattr(st, "st_birthtime", None) or st.st_ctime
    return datetime.fromtimestamp(born, timezone.utc).isoformat(timespec="seconds")


def last_said(path, cap: int = 600) -> str:
    """The agent's latest reply, cut to a readable length, for the top of the Activity column."""
    import transcript
    if path is None or not path.is_file():
        return ""
    size = path.stat().st_size
    held = _SAID.get(str(path))
    if held and held[0] == size:
        return held[1]
    # a long session's tail is mostly tool results, so the reply can sit megabytes back
    got = transcript.last_reply(path, limit=2_000_000, settled=False)
    text = " ".join((got[0] if got else "").split())
    text = text if len(text) <= cap else text[:cap].rstrip() + "…"
    _SAID[str(path)] = (size, text)
    return text


class ActivityController(Controller):
    """What is happening on an environment: the working agent's latest message, and the latest journal events."""
    resource = "activity"
    noun = "activity"
    actions = ("index",)
    numbered = ()

    def index(self, root: Path, p: Payload) -> Result:
        import commandlog
        import todo
        import worktree
        import retention
        commandlog.flush_stale(root, p.env)
        # closed items past their days listed and archived lose their content here, where the column polls
        retention.prune(root, p.env)
        return Result("ok", "", {"agent": self._agent(root, p.env), "auto": todo.auto(root, p.env),
                                 "branch": worktree.branch(root.resolve().parent),
                                 "events": self._events(root, p.env)})

    @staticmethod
    def _agent(root: Path, env: str) -> dict | None:
        import settings
        import state
        import tracks
        import transcript
        for stem, info in tracks.live(root).items():
            if info["track"] == env:
                window = settings.load(root)[0].get("context_window") or state.get(root, "window", 0) or 0
                path = transcript.find(root.parent, stem)
                return {"session": stem[:8], "seen": tracks.age_text(info["age"]), "working": agent_working(root, stem),
                        "compacting": agent_compacting(root, stem),
                        "context": context_use(path, window), "said": last_said(path), "started": session_started(path),
                        "model": transcript.last_model(path)}
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
            "comment": lambda: numbered(__import__("comments")._all(root, env), "text"),
        }
        titles: dict[str, dict] = {}

        def title_of(kind: str, n) -> str:
            if not str(n or "").isdigit() or kind not in lookups:
                return ""
            if kind not in titles:
                titles[kind] = lookups[kind]()
            return short(titles[kind].get(int(n), "") or "", TITLE_MAX)

        def add(at, kind: str, text: str, n: int | None, by: str, titled: bool = False, needs: str = "",
                detail: str = "", about: str = "", title: str = "", order: int = -1, sha: str = "") -> None:
            """`needs`: "open" when the line waits on the user, "answered" once they have answered it.
            `order`: a command-log line's place in the log, so lines logged in the same second list newest first."""
            if at:
                out.append({"at": at, "kind": kind, "n": n, "text": short(text),
                            "title": short(title, TITLE_MAX) if title else title_of(kind, n) if titled else "",
                            "by": by, "needs": needs, "detail": detail, "about": about, "order": order, "sha": sha})

        for wn, w in enumerate(work._all(root, env), 1):
            if w.get("removed"):
                continue
            add(w.get("at"), "work", say("work_started"), wn, AGENT, True)
            for note in w.get("notes") or []:
                add(note.get("at"), "work", say("work_note"), wn, AGENT, title=note.get("text") or "")
            add(w.get("ended"), "work", say("work_ended"), wn, AGENT, detail=work.files_changed(w))
        for t in todo._all(root, env):
            add(t.get("at"), "todo", say("todo_added"), t["n"], AGENT if t.get("session") else USER, True)
            add(t.get("done"), "todo", say("todo_closed"), t["n"], USER if t.get("closed_by") == "web" else AGENT)
        for n, q in enumerate(questions._all(root, env), 1):
            if q.get("removed"):
                continue
            withdrawn = q.get("withdrawn") or q.get("withdrawn_at")
            state = "withdrawn" if withdrawn else "answered" if q.get("answered_at") else ""
            add(q.get("at"), "question", say("question_asked"), n, AGENT, True,
                "answered" if state == "answered" else "" if state or q.get("seen_at") else "open", detail=state)
            add(q.get("answered_at"), "question", say("question_answered"), n, USER, needs="answered")
        suggestions = __import__("suggestions")
        for n, s in enumerate(suggestions._all(root, env), 1):
            if not isinstance(s, dict) or s.get("removed"):
                continue
            add(s.get("at"), "suggestion", say("suggestion_made"), n, AGENT, True,
                "open" if suggestions.status(s) == "open" else "")
        for n, c in enumerate(__import__("comments")._all(root, env), 1):
            if not isinstance(c, dict) or c.get("removed"):
                continue
            by = USER if c.get("source") == "web" else AGENT
            add(c.get("at"), "comment", say("comment_written"), n, by, True, about=c.get("about") or "")
            add(c.get("done_at"), "comment", say("comment_handled"), n, AGENT, about=c.get("about") or "")
        for n, m in enumerate(inbox._all(root, env), 1):
            if m.get("removed"):
                continue
            add(m.get("at"), "message", say("message_left"), n, USER, True)
            add(m.get("processed"), "message", say("message_processed"), n, AGENT, detail=became(m))
            for r in m.get("replies") or []:
                if r.get("part") and r.get("source") != "web":
                    # an answer asks nothing of the user, so it reads as a plain line that opens the message
                    add(r.get("at"), "message", say("message_answered"), n, AGENT)
        comments_mod = __import__("comments")
        about_of: dict[int, str] = {}
        for order, c in enumerate(commandlog.entries(root, env)):
            detail, about = c.get("detail", ""), ""
            # a line about one comment names what the comment is on, and opens it
            if c.get("kind") == "comment" and str(c.get("n") or "").isdigit():
                if not about_of:
                    about_of = numbered(comments_mod._all(root, env), "about") or {0: ""}
                about = about_of.get(int(c["n"]), "")
                detail = detail or (comments_mod.label(about) if about else "")
            add(c.get("at"), c.get("kind") or "command", c.get("text", ""), c.get("n"), c.get("by") or AGENT, c.get("titled", False),
                detail=detail, about=about, order=order, title=c.get("title", ""), sha=c.get("sha", ""))
        out.sort(key=lambda e: (e["at"], e.pop("order")), reverse=True)
        # the same line twice in a row, like a message read again for more context, shows once
        same = lambda a, b: (a["kind"], a["n"], a["text"], a["by"], a["title"]) == (b["kind"], b["n"], b["text"], b["by"], b["title"])
        kept = [e for i, e in enumerate(out) if not i or not same(e, out[i - 1])]
        return [{**e, "age": age(e["at"])} for e in kept[:commandlog.setting(root, env, commandlog.SHOW)]]
