import re
from pathlib import Path

from engine.events import AgentUpdated
from engine.proc import git
from features.parts import Context, Handler
from resources.base import Refused

TRAILER = re.compile(r"^Journal: todos done (\d+(?:, *\d+)*)(?: (.*))?$", re.MULTILINE)


class CloseRowsFromCommits(Handler):
    def __init__(self):
        self.seen: dict[str, int] = {}

    def handle(self, context: Context, event: AgentUpdated) -> None:
        project = context.record.root.parent
        if not self.moved(project):
            return
        commits = self.log(project)
        if not commits:
            return
        seen = context.record.cursor_text(context.feature.name)
        if seen:
            for sha, subject, body in commits:
                if sha == seen:
                    break
                self.close(context, sha, subject, body)
        context.record.set_cursor_text(context.feature.name, commits[0][0])

    def log(self, project) -> list[tuple[str, str, str]]:
        out = git(["log", "--format=%H%x1f%s%x1f%B%x1e", "-n", "50"], project)
        return [tuple(c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]

    def close(self, context: Context, sha: str, subject: str, body: str) -> None:
        todos = context.journal.todos
        for numbers, how in TRAILER.findall(body):
            for n in re.findall(r"\d+", numbers):
                try:
                    if not todos.load(int(n)).completed:
                        todos.complete(int(n), how=how or f"{subject} ({sha[:9]})", commit=sha)
                except Refused:
                    continue

    def moved(self, project) -> bool:
        try:
            stamp = (Path(project) / ".git" / "logs" / "HEAD").stat().st_mtime_ns
        except OSError:
            return True
        if self.seen.get(str(project)) == stamp:
            return False
        self.seen[str(project)] = stamp
        return True
