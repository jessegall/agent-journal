from datetime import timedelta

from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.database import Database
from engine.database.hook_calls_table import HookCallsTable
from engine.setting.setting_values import SettingValues
from engine.time.timestamp import Timestamp
from core.modules.drivers.commands.prune_hook_calls.prune_hook_calls import PruneHookCalls
from core.modules.drivers.support.driver_settings import DAYS_SETTING
from core.modules.drivers.ticks.hook_pruning import BATCH_ROWS


class PruneHookCallsHandler(Handler[PruneHookCalls, int]):
    """Deletes one batch of the hook calls older than the kept days and their delivered lines; the hourly tick
    runs the batches in transactions of their own, and the rule history is never pruned."""

    command = PruneHookCalls

    def __init__(self, database: Database, settings: SettingValues) -> None:
        self.table, self.settings = HookCallsTable(database), settings

    def handle(self, command: PruneHookCalls, context: Context) -> int:
        cutoff = Timestamp(context.timestamp.value - timedelta(days=self.settings.project.number(DAYS_SETTING)))
        deleted, _ = self.table.delete_batch(0, cutoff.text, BATCH_ROWS)
        return deleted
