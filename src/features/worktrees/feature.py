from engine.events.agents import SessionStarted
from expects import Given, Unchanged
from features.base import Feature
from features.journal import Journal
from features.worktrees.details import WorktreesDetails
from features.worktrees.handlers import LinkWorktreeJournal
from resources.types import AgentRow


class Worktrees(Feature):
    details = WorktreesDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(LinkWorktreeJournal(), expects=[
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1")]) >> Unchanged(),
            Given(SessionStarted(agent=1), rows=[AgentRow(n=1, title="claude-1", data={"cwd": "/nowhere/at/all"})]) >> Unchanged(),
        ])
