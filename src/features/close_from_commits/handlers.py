import re
from dataclasses import dataclass
from pathlib import Path

from events.agents import AgentReported
from engine.git import Checkout, checkout_of
from engine.proc import git
from framework.parts import ANY_BUT_PRE_TOOL_USE, AgentContext, Handler
from resources.base import SYSTEM, Refused
from resources.text import digest
from controllers.types import Agents, Todos, Works

MADE_HERE = "commit"
TRAILER = re.compile(r"^Journal: todos done (\d+(?:(?: *, *(?:and +)?| +and +| +)\d+\b)*)(?: +(.*))?$", re.MULTILINE)


SWEEP_COMMITS = 300


@dataclass(frozen=True)
class Commit:
    sha: str
    subject: str
    body: str


def landing_commits(checkout: Checkout, span: str, limit: int = SWEEP_COMMITS) -> list[Commit]:
    out = git(["log", "--format=%H%x1f%s%x1f%B%x1e", "-n", str(limit), span], checkout.top)
    return [Commit(*c.strip("\n").split("\x1f", 2)) for c in out.split("\x1e") if c.strip()]


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


def reflog(project) -> list[tuple[str, str, str, str]]:
    out = git(["log", "-g", "--format=%H%x1f%gs%x1f%s%x1f%B%x1e", "-n", "50"], project)
    return [tuple(c.strip("\n").split("\x1f", 3)) for c in out.split("\x1e") if c.strip()]


class Watched:
    """Which logs have changed since they were last looked at, per environment."""

    def __init__(self):
        self.seen: dict[tuple[str, str], int] = {}

    def moved(self, log: Path, environment: str) -> bool:
        try:
            stamp = log.stat().st_mtime_ns
        except OSError:
            return False
        key = (str(log), environment)
        if self.seen.get(key) == stamp:
            return False
        self.seen[key] = stamp
        return True


class CloseRowsFromCommits(Handler):
    hooks = ANY_BUT_PRE_TOOL_USE

    def __init__(self):
        self.watched = Watched()

    def handle(self, context: AgentContext, event: AgentReported) -> None:
        checkout = checkout_of(context.working_folder)
        if not checkout:
            return
        if self.watched.moved(checkout.head_log, context.record.env):
            self.made_here(context, checkout)
        if checkout.landing and not checkout.linked and self.watched.moved(checkout.landing_log, context.record.env):
            self.landed(context, checkout)

    def made_here(self, context: AgentContext, checkout: Checkout) -> None:
        commits = reflog(checkout.top)
        if not commits:
            return
        cursor = f"{context.feature.name}-{digest(str(checkout.head_log), 12)}"
        seen = context.record.event_log.cursor_text(cursor)
        shas = [sha for sha, *_ in commits]
        # The place is lost when the commit last looked at is no longer in the reflog window, which a rebase, a cherry-pick or a
        # stretch busier than the window all do. Then the whole window is read rather than none of it, since closing a row that is
        # already closed does nothing, and only the cards are left out, which would say the same thing twice.
        lost = seen not in shas
        for sha, action, subject, body in commits if lost else commits[:shas.index(seen)]:
            if not action.startswith(MADE_HERE):
                continue
            if not lost:
                context.journal.get(Agents).card(context.agent.row.n, label=f"Agent committed {sha[:8]} on `{checkout.branch}`", icon="branch", tone="commit", title=subject)
            self.close(context, Commit(sha, subject, body))
        context.record.event_log.set_cursor_text(cursor, commits[0][0])

    def landed(self, context: AgentContext, checkout: Checkout) -> None:
        cursor = f"{context.feature.name}-landed-{digest(checkout.landing, 12)}"
        seen = context.record.event_log.cursor_text(cursor)
        tip = git(["rev-parse", checkout.landing], checkout.top).strip()
        context.record.event_log.set_cursor_text(cursor, tip)
        if seen == tip:
            return
        for commit in (landing_commits(checkout, f"{seen}..{tip}") if seen else landing_commits(checkout, tip)):
            self.close(context, commit, held_only=not seen)

    def close(self, context: AgentContext, commit: Commit, held_only: bool = False) -> None:
        closed, ended = closing(context.journal.acting(SYSTEM).get(Todos), context.journal.get(Works), commit, held_only)
        if closed:
            context.agent.say("closed", sha=commit.sha[:9], rows=", ".join(closed), ended=f" and ended {', '.join(ended)}" if ended else "")
