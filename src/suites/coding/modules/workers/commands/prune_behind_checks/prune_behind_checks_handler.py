from datetime import timedelta

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.conditions.maximum import Maximum
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.commands.prune_behind_checks.prune_behind_checks import PruneBehindChecks
from suites.coding.modules.workers.models.enums.behind_check_state import BehindCheckState
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.worker_settings import CHECK_HISTORY_DAYS

CLOSED_STATES = (BehindCheckState.UPDATED, BehindCheckState.LEFT, BehindCheckState.GONE)
PRUNE_BATCH_COUNT = 200


class PruneBehindChecksHandler(Handler[PruneBehindChecks, int]):
    """Removes checks brought up to date, left alone or gone that last changed before the days they are kept, a
    batch at a time; an open, ordered, clashing or passed check is never removed. Answers how many it removed."""

    command = PruneBehindChecks

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: PruneBehindChecks, context: Context) -> int:
        cutoff = Timestamp(context.timestamp.value - timedelta(days=self.settings.number(CHECK_HISTORY_DAYS)))
        old = self.queries.query(WorktreeBehindCheck).matching(Among("state", CLOSED_STATES)).matching(Maximum("updated_at", cutoff.text)).ordered("updated_at", "id").limited(PRUNE_BATCH_COUNT)
        self.repository.delete_many_stored(old, context)
        return len(old)
