import re
from pathlib import Path

from controllers.types import Todos
from features.base import Feature, event
from resources.base import Refused, SYSTEM
from engine.proc import git

TRAILER = re.compile(r"^Journal: todos done (\d+(?:, *\d+)*)(?: (.*))?$", re.MULTILINE)


class Commits(Feature):
    name = "commits"
    title_ = "Closing rows from commits"
    abstract_ = "A commit whose message carries Journal: todos done <n> closes that row"
    help_ = "The trailer starts at column 0; prose and indented examples close nothing."

    def __init__(self):
        self.seen: dict[str, int] = {}

    def log(self, project) -> list[tuple[str, str, str]]:
        out = git(["log", "--format=%H%x1f%s%x1f%B%x1e", "-n", "50"], project)
        return [tuple(c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]

    def close(self, record, sha: str, subject: str, body: str) -> None:
        todos = Todos(record, actor=SYSTEM)
        for numbers, how in TRAILER.findall(body):
            for n in re.findall(r"\d+", numbers):
                self.closed(todos, int(n), how or f"{subject} ({sha[:9]})", sha)

    def closed(self, todos, n: int, how: str, sha: str) -> None:
        try:
            if not todos.load(n).completed:
                todos.complete(n, how=how, commit=sha)
        except Refused:
            return

    def moved(self, project) -> bool:
        try:
            stamp = (Path(project) / ".git" / "logs" / "HEAD").stat().st_mtime_ns
        except OSError:
            return True
        if self.seen.get(str(project)) == stamp:
            return False
        self.seen[str(project)] = stamp
        return True

    @event("agent.updated")
    def read(self, event, record) -> None:
        if not self.moved(record.root.parent):
            return
        commits = self.log(record.root.parent)
        if not commits:
            return
        seen = record.cursor_text("commits")
        if seen:
            for sha, subject, body in commits:
                if sha == seen:
                    break
                self.close(record, sha, subject, body)
        record.set_cursor_text("commits", commits[0][0])
