from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.database.database import Database
from engine.database.hook_calls_table import HookCallsTable
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from engine.time.timestamp import Timestamp
from core.modules.drivers.commands.prune_temp_folders.prune_temp_folders import PruneTempFolders
from core.modules.drivers.commands.prune_runtime_folders.prune_runtime_folders import PruneRuntimeFolders
from core.modules.drivers.support.driver_settings import DAYS_SETTING

BATCH_ROWS = 500
MOST_BATCHES = 20


class HookPruning:
    """The hook calls older than the kept days are deleted in short batches, each in its own transaction, and the
    temp folders of ended sessions and the stale runtime folders removed."""

    def __call__(self, container: Container) -> None:
        database, table = container.get(Database), HookCallsTable(container.get(Database))
        cutoff = Timestamp(container.get(Clock).timestamp().value - timedelta(days=container.get(SettingValues).project.number(DAYS_SETTING))).text
        last_id = 0
        for _ in range(MOST_BATCHES):
            with database.transaction():
                _, next_id = table.delete_batch(last_id, cutoff, BATCH_ROWS)
            if next_id == last_id:
                break
            last_id = next_id
        container.get(Bus).run(PruneTempFolders(), Actor.core())
        container.get(Bus).run(PruneRuntimeFolders(), Actor.core())
