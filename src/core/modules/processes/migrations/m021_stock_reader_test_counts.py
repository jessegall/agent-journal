from engine.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class StockReaderTestCountsMigration(Migration):
    """Gives the core's pytest and vitest readers their test count fields."""

    number = 21
    statements = tuple(
        f"UPDATE readers SET count_pattern = {quoted(reader.count)}, count_command = {quoted(reader.count_command)} "
        f"WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in STOCK_READERS if reader.count
    )
