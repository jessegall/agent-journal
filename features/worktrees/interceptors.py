from pathlib import Path

from engine.worktree import checkout
from features.parts import AgentContext, ToolInterceptor
from features.worktrees.links import excluded


class LinkWorktreeJournal(ToolInterceptor):
    def intercept(self, context: AgentContext, call) -> str:
        cwd = getattr(context.hook, "cwd", "")
        top = checkout(Path(cwd)) if cwd else None
        journal = top / ".journal" if top else None
        if journal and not journal.exists() and not journal.is_symlink() and top.resolve() != context.record.root.resolve().parent:
            journal.symlink_to(context.record.root.resolve(), target_is_directory=True)
            excluded(top)
        return ""
