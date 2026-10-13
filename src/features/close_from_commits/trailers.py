import re
from dataclasses import dataclass

from controllers.types import Todos, Works
from resources.base import Refused

TRAILER = re.compile(r"^Journal: todos done (\d+(?:(?: *, *(?:and +)?| +and +| +)\d+\b)*)(?: +(.*))?$", re.MULTILINE)
SWEEP_COMMITS = 300
COMMIT_FORMAT = "--format=%H%x1f%s%x1f%B%x1e"
REFLOG_FORMAT = "--format=%H%x1f%gs%x1f%s%x1f%B%x1e"


@dataclass(frozen=True)
class Commit:
    sha: str
    subject: str
    body: str


def landing_args(span: str, limit: int = SWEEP_COMMITS) -> list[str]:
    """The git command that lists the commits of a span, newest first."""
    return ["log", COMMIT_FORMAT, "-n", str(limit), span]


def commits_of(out: str) -> list[Commit]:
    return [Commit(*c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]


REFLOG = ["log", "-g", REFLOG_FORMAT, "-n", "50"]


def reflog_of(out: str) -> list[tuple[str, str, str, str]]:
    return [tuple(c.strip("\n").split("\x1f", 3)) for c in out.split("\x1e") if c.strip()]


def closing(todos: Todos, works: Works, commit: Commit, held_only: bool = False) -> tuple[list[str], list[str]]:
    closed, ended = [], []
    for numbers, how in TRAILER.findall(commit.body):
        for n in re.findall(r"\d+", numbers):
            try:
                row = todos.load(n)
                if row.completed or (held_only and not row.assigned):
                    continue
                open_work = [w.n for w in works._for_todo(n)]
                todos.complete(int(n), how=how or f"{commit.subject} ({commit.sha[:9]})", commit=commit.sha)
            except Refused:
                continue
            closed.append(f"to-do {n}")
            ended += [f"work {w}" for w in open_work if works.load(w).completed]
    return closed, ended
