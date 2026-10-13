from pathlib import Path

from events import Fact
from events.agents import SessionStarted
from events.worktrees import WorktreeToLink
from receiving import Listener
from resources.types import AgentRow
from serving import Providers, ReadGit, ReadRows


class SpotSessionInAWorktree(Listener[SessionStarted]):
    def listen(self, event: SessionStarted, agents: ReadRows[AgentRow], git: ReadGit, providers: Providers) -> list[Fact]:
        cwd = agents.peek(event.agent).cwd
        top = git.worktree(Path(cwd), providers.workspaces()) if cwd else None
        return [WorktreeToLink(agent=event.agent, top=str(top))] if top else []
