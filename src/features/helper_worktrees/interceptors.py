from pathlib import Path

from engine.reach import Reach
from features.helper_worktrees.controller import Worktrees
from features.parts import AgentContext, ToolInterceptor
from resources.base import SYSTEM


class TellDrift(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        hook = context.hook
        subagent = context.provider.is_subagent(hook)
        here = Path(hook.cwd) if hook.cwd else Path.cwd()
        places = tuple((here / given).resolve() for given in (str(here), *(call.paths if subagent else ())))
        worktrees = Worktrees(context.record, actor=SYSTEM)
        for row in worktrees._touched(places, tuple(call.commands) if subagent else ()):
            found = worktrees._drift(row)
            if found.current or row.told == found.tip:
                continue
            worktrees._told(row, found.tip)
            return context.feature.line("drifted", {"working": row.working, "commits": found.told, "path": row.path})[0]
        return ""
