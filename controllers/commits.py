from __future__ import annotations

import re
from pathlib import Path

import pins
import work
from controller import Controller, Result
from controllers.work import WorkController
from payloads import commits as commit_payloads
from templates import render as fill

MESSAGES = {
    "bad_sha": "{sha!r} is not a commit hash: give 7 to 40 of its hex characters",
    "no_commit": "no commit starting {sha} was made during work on this environment",
}

SHA = re.compile(r"^[0-9a-f]{7,40}$")


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class CommitsController(Controller):
    """A commit made while work was open: the work it went onto, and that work's to-dos."""
    resource = "commits"
    noun = "commit"
    actions = ("index",)
    numbered = ()
    payloads = {"index": commit_payloads.ShowPayload}

    def index(self, root: Path, p: commit_payloads.ShowPayload) -> Result:
        sha = (p.sha or "").strip().lower()
        if not SHA.match(sha):
            return Result("refused", say("bad_sha", sha=p.sha or ""))
        todos = WorkController._todos(root, p.env)
        found, rows, tied = None, [], {}
        for n, w in enumerate(work._all(root, p.env), 1):
            if w.get("removed"):
                continue
            hit = next((c for c in w.get("commits") or [] if c.get("sha", "").startswith(sha)), None)
            if hit is None:
                continue
            found = found or hit
            rows.append({"n": n, "subject": w.get("subject", ""), "ended": bool(w.get("ended"))})
            wt = w.get("todo")
            t = todos["by_n"].get(int(wt)) if str(wt).isdigit() else todos["by_title"].get(w.get("subject", "").lower())
            if t:
                tied[t["n"]] = {"n": t["n"], "title": t["title"], "done": bool(t.get("done"))}
        if found is None:
            return Result("missing", say("no_commit", sha=sha))
        at = found.get("at", "")
        return Result("ok", "", {"sha": found["sha"], "subject": found.get("subject", ""), "at": at,
                                 "age": pins.age(at) if at else "", "work": rows,
                                 "todos": [tied[k] for k in sorted(tied)]})
