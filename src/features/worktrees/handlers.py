from pathlib import Path

from events import Fact
from events.worktrees import WorktreeToLink
from receiving import Handler
from serving import Git, Providers


class LinkWorktreeJournal(Handler[WorktreeToLink]):
    def handle(self, event: WorktreeToLink, git: Git, providers: Providers) -> list[Fact]:
        git.link(Path(event.top), providers.workspaces())
        return []
