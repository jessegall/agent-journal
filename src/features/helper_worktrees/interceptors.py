from pathlib import Path

from agents.terminal import Launched
from engine.journal_calls import pieces
from engine.reach import Reach
from engine.worktree import checkout
from features.helper_worktrees.controller import Worktrees
from features.parts import AgentContext, ToolInterceptor
from providers.catalogue import workspace_folders
from resources.base import SYSTEM


class TellDrift(ToolInterceptor):
    reach = Reach.BOTH

    def intercept(self, context: AgentContext, call) -> str:
        hook = context.hook
        subagent = context.provider.is_subagent(hook)
        here = Path(hook.cwd) if hook.cwd else Path.cwd()
        places = tuple((here / given).resolve() for given in (str(here), *(call.paths if subagent else ())))
        drifted = Worktrees(context.record, actor=SYSTEM)._drifted(places, tuple(call.commands) if subagent else ())
        if drifted is None:
            return ""
        row, found = drifted
        return context.feature.line("drifted", {"working": row.working, "commits": found.commits, "path": row.path})[0]


class StayInYourCheckout(ToolInterceptor):
    reach = Reach.MAIN

    def intercept(self, context: AgentContext, call) -> str:
        hook = context.hook
        home = Path(Launched.read(context.record.root, hook.session).cwd or context.record.root.parent)
        if not hook.cwd or self.checkout_of(Path(hook.cwd)) == self.checkout_of(home) or self.goes_home(call.shell_command, home):
            return ""
        return context.feature.line("strayed", {"folder": hook.cwd, "home": home})[0]

    def checkout_of(self, folder: Path) -> Path | None:
        return checkout(folder.resolve(), workspace_folders())

    def goes_home(self, shell: str, home: Path) -> bool:
        first = pieces(shell)[0] if shell else ()
        return first[:1] == ("cd",) and len(first) == 2 and Path(first[1]).expanduser().resolve() == home.resolve()
