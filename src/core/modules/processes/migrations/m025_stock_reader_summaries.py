from engine.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class StockReaderSummariesMigration(Migration):
    """Gives the core's readers that had none a summary pattern, so a new journal holds no reader to correct."""

    number = 25
    statements = tuple(
        f"UPDATE readers SET summary_pattern = {quoted(reader.summary)} "
        f"WHERE name = {quoted(reader.name)} AND creator_id = 1 AND summary_pattern = ''"
        for reader in STOCK_READERS if reader.summary
    )
