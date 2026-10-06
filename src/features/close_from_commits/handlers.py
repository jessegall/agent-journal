import re

from engine.events.agents import AgentReported
from engine.git import Checkout, checkout_of
from engine.proc import git
from features.parts import ANY_BUT_PRE_TOOL_USE, AgentContext, Handler
from resources.base import Refused
from engine.wording import digest
from controllers.types import Agents, Todos, Works

MADE_HERE = "commit"
TRAILER = re.compile(r"^Journal: todos done (\d+(?:(?: *, *(?:and +)?| +and +| +)\d+\b)*)(?: +(.*))?$", re.MULTILINE)


class CloseRowsFromCommits(Handler):
    hooks = ANY_BUT_PRE_TOOL_USE
    def __init__(self):
        self.seen: dict[tuple[str, str], int] = {}

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        checkout = checkout_of(context.working_folder)
        if not checkout or not self.moved(checkout, context.record.env):
            return
        commits = self.log(checkout.top)
        if not commits:
            return
        cursor = f"{context.feature.name}-{digest(str(checkout.head_log), 12)}"
        seen = context.record.event_log.cursor_text(cursor)
        context.record.event_log.set_cursor_text(cursor, commits[0][0])
        shas = [sha for sha, *_ in commits]
        if seen not in shas:
            return
        for sha, action, subject, body in commits[:shas.index(seen)]:
            if not action.startswith(MADE_HERE):
                continue
            context.journal.get(Agents).card(context.agent.row.n, label=f"Agent committed {sha[:8]} on `{checkout.branch}`", icon="branch", tone="commit", title=subject)
            self.close(context, sha, subject, body)

    def log(self, project) -> list[tuple[str, str, str, str]]:
        out = git(["log", "-g", "--format=%H%x1f%gs%x1f%s%x1f%B%x1e", "-n", "50"], project)
        return [tuple(c.strip("\n").split("\x1f", 3)) for c in out.split("\x1e") if c.strip()]

    def close(self, context: AgentContext, sha: str, subject: str, body: str) -> None:
        todos, works = context.journal.get(Todos), context.journal.get(Works)
        closed, ended = [], []
        for numbers, how in TRAILER.findall(body):
            for n in re.findall(r"\d+", numbers):
                try:
                    if todos.load(n).completed:
                        continue
                    open_work = [w.n for w in works._for_todo(n)]
                    todos.complete(int(n), how=how or f"{subject} ({sha[:9]})", commit=sha)
                except Refused:
                    continue
                closed.append(f"to-do {n}")
                ended += [f"work {w}" for w in open_work if works.load(w).completed]
        if closed:
            context.agent.say("closed", sha=sha[:9], rows=", ".join(closed), ended=f" and ended {', '.join(ended)}" if ended else "")

    def moved(self, checkout: Checkout, environment: str) -> bool:
        try:
            stamp = checkout.head_log.stat().st_mtime_ns
        except OSError:
            return False
        key = (str(checkout.top), environment)
        if self.seen.get(key) == stamp:
            return False
        self.seen[key] = stamp
        return True
