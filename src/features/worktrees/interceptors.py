from pathlib import Path

from engine.worktree import checkout, share_journal
from features.parts import AgentContext, ToolInterceptor


class LinkWorktreeJournal(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        cwd = getattr(context.hook, "cwd", "")
        top = checkout(Path(cwd)) if cwd else None
        if top:
            share_journal(top, context.record.root)
        return ""
