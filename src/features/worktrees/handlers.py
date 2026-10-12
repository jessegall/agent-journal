from pathlib import Path

from events.agents import SessionStarted
from engine.worktree import checkout, share_journal
from serving import SERVED, Providers
from framework.parts import AgentContext, Handler


class LinkWorktreeJournal(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        cwd = context.agent.row.cwd
        workspaces = SERVED.given(Providers).workspaces()
        top = checkout(Path(cwd), workspaces) if cwd else None
        if top:
            share_journal(top, context.record.root, workspaces)
