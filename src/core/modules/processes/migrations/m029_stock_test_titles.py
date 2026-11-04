from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class StockTestTitlesMigration(Migration):
    number = 29
    statements = tuple(
        f"UPDATE readers SET title = {quoted(reader.title)}, progress_pattern = {quoted(reader.progress)} WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in STOCK_READERS if reader.name in ("pytest", "vitest", "dotnet-test", "phpunit")
    )
