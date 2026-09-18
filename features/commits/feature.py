import re
import subprocess

from controllers.types import Todos
from features.base import Feature, on
from resources.base import Refused, SYSTEM

TRAILER = re.compile(r"^Journal: todos done (\d+)(?: (.*))?$", re.MULTILINE)


class Commits(Feature):
    name = "commits"
    title_ = "Commits"
    abstract_ = "A commit whose message carries Journal: todos done <n> closes that row"
    help_ = "The trailer starts at column 0; prose and indented examples close nothing."

    def log(self, project) -> list[tuple[str, str, str]]:
        try:
            out = subprocess.run(["git", "log", "--format=%H%x1f%s%x1f%B%x1e", "-n", "50"], cwd=project,
                                 capture_output=True, text=True, timeout=5).stdout
        except (OSError, subprocess.SubprocessError):
            return []
        return [tuple(c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]

    def close(self, record, sha: str, subject: str, body: str) -> None:
        todos = Todos(record, actor=SYSTEM)
        for n, how in TRAILER.findall(body):
            try:
                if not todos.load(int(n)).completed:
                    todos.complete(int(n), how=how or f"{subject} ({sha[:9]})", commit=sha)
            except Refused:
                continue

    @on("agent.updated")
    def read(self, event, record) -> None:
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
