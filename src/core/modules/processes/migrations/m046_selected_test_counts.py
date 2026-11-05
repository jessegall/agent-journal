from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class SelectedTestCountsMigration(Migration):
    """Gives the core's pytest reader the count pattern that reads the selected tests of a filtered run."""

    number = 46
    statements = tuple(
        f"UPDATE readers SET count_pattern = {quoted(reader.count)} WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in STOCK_READERS if reader.name == "pytest"
    )
