from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.log_level import LogLevel
from engine.errors.refusal import Refusal
from engine.log.system_log_writer import SystemLogWriter
from engine.scope.scopes import Scopes
from engine.time.clock import Clock
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.commands.announce_behind_checks.announce_behind_checks import AnnounceBehindChecks
from suites.coding.modules.workers.commands.check_worktree_behind.check_worktree_behind import CheckWorktreeBehind
from suites.coding.modules.workers.models.enums.behind_route import BehindRoute
from suites.coding.modules.workers.commands.record_stale_check.record_stale_check import RecordStaleCheck
from suites.coding.modules.workers.commands.remind_behind_updates.remind_behind_updates import RemindBehindUpdates
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.behind_checks import BehindChecks


class BehindWorktrees:
    """Looks, once the minutes between looks have passed, at how far each cut worktree of an environment is
    behind its base branch, and opens a check for one far enough behind. A worktree whose count fails is
    logged and the look goes on with the others. The worktrees one look leaves to the merger start it once.
    Each tick also reminds the workers of an ordered update they have not run."""

    def __call__(self, container: Container) -> None:
        cut = (row for row in container.get(WorktreeQuery).all_worktrees() if row.state is WorktreeState.CUT)
        for environment_id in dict.fromkeys(row.environment_id for row in cut):
            container.get(Bus).run(RemindBehindUpdates(), Actor.core(), environment_id=environment_id)
            with container.get(Scopes).opened(None, environment_id):
                due = container.get(BehindChecks).due_worktrees(container.get(Clock).timestamp())
            routes = {worktree.id: self.checked(container, worktree.id, environment_id) for worktree in due}
            if not due:
                continue
            container.get(Bus).run(RecordStaleCheck(), Actor.core(), environment_id=environment_id)
            merger_checks = tuple(worktree_id for worktree_id, route in routes.items() if route is BehindRoute.MERGER)
            if merger_checks:
                self.announced(container, merger_checks, environment_id)

    @staticmethod
    def announced(container: Container, worktree_ids: tuple[int, ...], environment_id: int) -> None:
        lines = container.get(Bus).run(AnnounceBehindChecks(worktree_ids), Actor.core(), environment_id=environment_id)
        with container.get(Scopes).opened(None, environment_id):
            merger_enabled = container.get(SettingValues).flag(MERGER_ENABLED)
        if merger_enabled:
            container.get(Bus).run(StartMerger(lines[0], container.get(Clock).timestamp()), Actor.core(), environment_id=environment_id)

    @staticmethod
    def checked(container: Container, worktree_id: int, environment_id: int) -> BehindRoute:
        try:
            return container.get(Bus).run(CheckWorktreeBehind(worktree_id), Actor.core(), environment_id=environment_id)
        except Refusal as refusal:
            container.get(SystemLogWriter).write(LogLevel.WARNING, f"the look at worktree {worktree_id} behind its base failed: {refusal.text}")
            return BehindRoute.NONE
