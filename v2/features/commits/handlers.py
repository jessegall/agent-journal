import re
import subprocess

from v2.controllers.types import CONTROLLERS
from v2.features import on
from v2.resources.base import Refused, SYSTEM

FEATURE = "commits"
TRAILER = re.compile(r"^Journal: todos done (\d+)(?: (.*))?$", re.MULTILINE)


def log(project) -> list[tuple[str, str, str]]:
    try:
        out = subprocess.run(["git", "log", "--format=%H%x1f%s%x1f%B%x1e", "-n", "50"], cwd=project,
                             capture_output=True, text=True, timeout=5).stdout
    except (OSError, subprocess.SubprocessError):
        return []
    return [tuple(c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]


def close(record, sha: str, subject: str, body: str) -> None:
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    for n, how in TRAILER.findall(body):
        try:
            if not todos.load(int(n)).completed:
                todos.complete(int(n), how=how or f"{subject} ({sha[:9]})", commit=sha)
        except Refused:
            continue


def read(event, record) -> None:
    commits = log(record.root.parent)
    if not commits:
        return
    seen = record.cursor_text("commits")
    head = commits[0][0]
    if seen:
        for sha, subject, body in commits:
            if sha == seen:
                break
            close(record, sha, subject, body)
    record.set_cursor_text("commits", head)


def register() -> None:
    on(FEATURE, "agent.updated", read)
