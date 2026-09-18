from __future__ import annotations

import re
import subprocess
from pathlib import Path

import pins
import work
from controller import Controller, Result
from controllers.work import WorkController
from payloads import commits as commit_payloads
from templates import render as fill

MESSAGES = {
    "bad_sha": "`{sha}` is not a commit hash: give 7 to 40 of its hex characters",
    "no_commit": "no commit starting {sha} is in this repository",
}

SHA = re.compile(r"^[0-9a-f]{7,40}$")

#: pull requests found per commit, so a page shown again does not ask GitHub again
_PULLS: dict[str, dict | None] = {}


def _git(project: Path, *args: str) -> str | None:
    try:
        p = subprocess.run(["git", *args], cwd=str(project), capture_output=True, text=True, timeout=5)
    except (OSError, subprocess.SubprocessError):
        return None
    return p.stdout if p.returncode == 0 else None


def repo_url(remote: str) -> str:
    remote = (remote or "").strip()
    got = re.match(r"^(?:https?://|ssh://git@)([^/:]+)[/:](.+?)(?:\.git)?/?$", remote) or re.match(r"^git@([^:]+):(.+?)(?:\.git)?$", remote)
    return f"https://{got.group(1)}/{got.group(2)}" if got else ""


def details(project: Path, sha: str) -> dict:
    shown = _git(project, "show", "-s", "--format=%an%x00%aI%x00%b", sha)
    if shown is None:
        return {"author": "", "date": "", "body": "", "files": [], "url": ""}
    author, date, body = (shown.split("\x00") + ["", "", ""])[:3]
    files = []
    for line in (_git(project, "show", "--numstat", "--format=", sha) or "").splitlines():
        parts = line.split("\t", 2)
        if len(parts) == 3:
            files.append({"path": parts[2], "added": int(parts[0]) if parts[0].isdigit() else 0,
                          "removed": int(parts[1]) if parts[1].isdigit() else 0})
    base = repo_url(_git(project, "remote", "get-url", "origin") or "")
    return {"author": author.strip(), "date": date.strip(), "body": body.strip(), "files": files,
            "url": f"{base}/commit/{sha}" if base else ""}


def pull_request(project: Path, sha: str) -> dict | None:
    if sha in _PULLS:
        return _PULLS[sha]
    import json
    got = None
    try:
        p = subprocess.run(["gh", "pr", "list", "--state", "all", "--search", sha, "--json", "number,title,url,state"],
                           cwd=str(project), capture_output=True, text=True, timeout=6)
        found = json.loads(p.stdout) if p.returncode == 0 and p.stdout.strip() else []
        got = found[0] if found else None
    except (OSError, subprocess.SubprocessError, ValueError):
        return None
    _PULLS[sha] = got
    return got


def say(message: str, /, **values) -> str:
    return fill(MESSAGES[message], **values)


class CommitsController(Controller):
    resource = "commits"
    noun = "commit"
    actions = ("index",)
    numbered = ()
    payloads = {"index": commit_payloads.ShowPayload}

    def _from_git(self, root: Path, sha: str) -> Result:
        full = (_git(root.parent, "rev-parse", "--verify", f"{sha}^{{commit}}") or "").strip()
        if not full:
            return Result("missing", say("no_commit", sha=sha))
        subject = (_git(root.parent, "show", "-s", "--format=%s", full) or "").strip()
        known = details(root.parent, full)
        at = known["date"]
        return Result("ok", "", {"sha": full, "subject": subject, "at": at,
                                 "age": pins.age(at) if at else "", "work": [], "todos": [],
                                 **known, "pull_request": pull_request(root.parent, full) if known["url"] else None})

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
            # THE JOURNAL IS NOT THE ONLY RECORD OF A COMMIT. Activity links every sha it logged,
            # and a commit made between two pieces of work — or while the work that held it was
            # another session's — is on none of them. It still exists, and the reader clicked it
            # because they wanted to see it, so git answers when the journal cannot.
            return self._from_git(root, sha)
        at = found.get("at", "")
        known = details(root.parent, found["sha"])
        return Result("ok", "", {"sha": found["sha"], "subject": found.get("subject", ""), "at": at,
                                 "age": pins.age(at) if at else "", "work": rows,
                                 "todos": [tied[k] for k in sorted(tied)], **known,
                                 "pull_request": pull_request(root.parent, found["sha"]) if known["url"] else None})
