from pathlib import Path

from engine.events.agents import SessionStarted
from engine.worktree import checkout, share_journal
from features.parts import AgentContext, Handler


class LinkWorktreeJournal(Handler):
    def handle(self, context: AgentContext, event: SessionStarted) -> None:
        cwd = context.agent.row.cwd
        top = checkout(Path(cwd)) if cwd else None
        if top:
            share_journal(top, context.record.root)
