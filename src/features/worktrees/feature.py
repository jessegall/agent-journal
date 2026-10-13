from pathlib import Path

from events.agents import SessionStarted
from events.worktrees import WorktreeToLink
from expects import Dispatches, Given, Ran, answering, nothing
from features.worktrees.details import WorktreesDetails
from features.worktrees.handlers import LinkWorktreeJournal
from features.worktrees.listeners import SpotSessionInAWorktree
from framework.base import Feature
from framework.journal import Journal
from resources.types import AgentRow

IN_A_WORKTREE = AgentRow(n=1, title="claude-1", data={"cwd": "/work/app-wt"})


class Worktrees(Feature):
    details = WorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.events.listen(SessionStarted, SpotSessionInAWorktree(), expects=[
            Given(SessionStarted(agent=1), rows=[IN_A_WORKTREE], git=answering({("worktree",): Path("/work/app-wt")})) >> Dispatches(WorktreeToLink(agent=1, top="/work/app-wt")),
            Given(SessionStarted(agent=1), rows=[IN_A_WORKTREE], git=answering({("worktree",): None})) >> Dispatches(nothing),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Dispatches(nothing),
        ])
        journal.events.handle(WorktreeToLink, LinkWorktreeJournal(), expects=[
            Given(WorktreeToLink(agent=1, top="/work/app-wt"), rows=[IN_A_WORKTREE]) >> Ran(("link", "app-wt")),
        ])
