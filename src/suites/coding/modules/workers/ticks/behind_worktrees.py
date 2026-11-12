from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.scope.scopes import Scopes
from engine.time.clock import Clock
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind import CheckWorktreeBehind
from suites.coding.modules.workers.commands.record_behind_look.record_behind_look import RecordBehindLook
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_checks import BehindChecks


class BehindWorktrees:
    """Looks, once the minutes between looks have passed, at how far each cut worktree of an environment is behind
    its base branch, and opens a check for one far enough behind. A worktree whose count fails is logged and the
    look goes on with the others."""

    def __call__(self, container: Container) -> None:
        cut = (row for row in container.get(WorktreeQuery).all_worktrees() if row.state is WorktreeState.CUT)
        for environment_id in dict.fromkeys(row.environment_id for row in cut):
            with container.get(Scopes).opened(None, environment_id):
                due = container.get(BehindChecks).due_worktrees(container.get(Clock).timestamp())
            for worktree in due:
                self.checked(container, worktree.id, environment_id)
            if due:
                container.get(Bus).run(RecordBehindLook(), Actor.core(), environment_id=environment_id)

    @staticmethod
    def checked(container: Container, worktree_id: int, environment_id: int) -> None:
        try:
            container.get(Bus).run(CheckWorktreeBehind(worktree_id), Actor.core(), environment_id=environment_id)
        except Refusal as refusal:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"the look at worktree {worktree_id} behind its base failed: {refusal.text}")
