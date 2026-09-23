import re
from pathlib import Path

from engine.events import AgentReported
from engine.proc import git
from features.parts import AgentContext, Context, Handler
from resources.base import Refused

TRAILER = re.compile(r"^Journal: todos done (\d+(?:, *\d+)*)(?: (.*))?$", re.MULTILINE)


class CloseRowsFromCommits(Handler):
    def __init__(self):
        self.seen: dict[str, int] = {}

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        project = context.record.root.parent
        if not self.moved(project):
            return
        commits = self.log(project)
        if not commits:
            return
        seen = context.record.cursor_text(context.feature.name)
        if seen:
            branch = git(["branch", "--show-current"], project).strip() or "a detached head"
            for sha, subject, body in commits:
                if sha == seen:
                    break
                context.journal.agents.card(context.agent.row.n, label=f"Agent committed {sha[:8]} on {branch}", icon="branch", tone="commit", title=subject)
                self.close(context, sha, subject, body)
        context.record.set_cursor_text(context.feature.name, commits[0][0])

    def log(self, project) -> list[tuple[str, str, str]]:
        out = git(["log", "--format=%H%x1f%s%x1f%B%x1e", "-n", "50"], project)
        return [tuple(c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]

    def close(self, context: AgentContext, sha: str, subject: str, body: str) -> None:
        todos, works = context.journal.todos, context.journal.works
        closed, ended = [], []
        for numbers, how in TRAILER.findall(body):
            for n in re.findall(r"\d+", numbers):
                try:
                    if todos.load(int(n)).completed:
                        continue
                    open_work = [w.n for w in works._standing() if int(w.todo) == int(n)]
                    todos.complete(int(n), how=how or f"{subject} ({sha[:9]})", commit=sha)
                except Refused:
                    continue
                closed.append(f"to-do {n}")
                ended += [f"work {w}" for w in open_work if works.load(w).completed]
        if closed:
            context.agent.say("closed", sha=sha[:9], rows=", ".join(closed), ended=f" and ended {', '.join(ended)}" if ended else "")

    def moved(self, project) -> bool:
        try:
            stamp = (Path(project) / ".git" / "logs" / "HEAD").stat().st_mtime_ns
        except OSError:
            return False
        if self.seen.get(str(project)) == stamp:
            return False
        self.seen[str(project)] = stamp
        return True
