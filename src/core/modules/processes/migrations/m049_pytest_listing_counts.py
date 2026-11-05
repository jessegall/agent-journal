from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class PytestListingCountsMigration(Migration):
    """Updates the stock pytest reader to count quiet listings."""

    number = 49
    reader = next(reader for reader in STOCK_READERS if reader.name == "pytest")
    statements = [f"UPDATE readers SET count_pattern = {quoted(reader.count)} WHERE name = 'pytest' AND creator_id = 1"]
