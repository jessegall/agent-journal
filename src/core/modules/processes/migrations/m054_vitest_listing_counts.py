from engine.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class VitestListingCountsMigration(Migration):
    """Updates the stock vitest reader to count the tests a listing names, since vitest prints no total."""

    number = 54
    reader = next(reader for reader in STOCK_READERS if reader.name == "vitest")
    statements = [f"UPDATE readers SET count_pattern = {quoted(reader.count)}, count_command = {quoted(reader.count_command)} WHERE name = 'vitest' AND creator_id = 1"]
