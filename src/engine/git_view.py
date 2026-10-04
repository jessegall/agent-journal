import re
from pathlib import Path
from typing import TypedDict

from engine.proc import git, ran
from engine.project_files import project_path, readable_path
from resources.base import Missing, Refused


class Commit(TypedDict):
    sha: str
    author: str
    at: float
    subject: str
    body: str
    stat: str
    diff: str


class FileDiff(TypedDict):
    path: str
    diff: str


def commit(project: Path, sha: str) -> Commit:
    if not re.fullmatch(r"[0-9a-f]{7,40}", sha):
        raise Missing("not a commit")
    head = ran(["git", "show", "-s", "--format=%H%x1f%an%x1f%at%x1f%s%x1f%b", sha], project)
    if head is None:
        raise Missing("git did not answer")
    if head.returncode:
        raise Missing(f"no commit {sha}")
    changed = git(["diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", sha], project).split("\0")
    allowed = [path for path in changed if readable_path(project, project / path)]
    stat = git(["--literal-pathspecs", "show", "--stat=120", "--format=", sha, "--", *allowed], project) if allowed else ""
    diff = git(["--literal-pathspecs", "show", "--format=", "--no-color", sha, "--", *allowed], project, timeout=10) if allowed else ""
    full, author, at, subject, body = (head.stdout.rstrip("\n").split("\x1f", 4) + ["", "", "", ""])[:5]
    return {"sha": full, "author": author, "at": float(at) if at else 0.0, "subject": subject, "body": body, "stat": stat, "diff": diff[:200000]}


def file_diff(project: Path, asked: str) -> FileDiff:
    target = project_path(project, asked)
    if not target.is_file():
        raise Refused(f"{asked!r} is not a file in the project that may be read")
    relative = str(target.relative_to(project))
    diff = git(["--literal-pathspecs", "diff", "--no-color", "HEAD", "--", relative], project, timeout=10)
    if not diff and not git(["--literal-pathspecs", "ls-files", "--", relative], project):
        diff = git(["--literal-pathspecs", "diff", "--no-color", "--no-index", "--", "/dev/null", relative], project, timeout=10)
    return {"path": relative, "diff": diff[:200000]}
