from engine.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class TestReaderProgressMigration(Migration):
    """Updates stock test readers to count completed tests."""

    number = 52
    statements = tuple(
        f"UPDATE readers SET progress_pattern = {quoted(reader.progress)}, step_pattern = {quoted(reader.step)} "
        f"WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in STOCK_READERS if reader.name in ("pytest", "vitest")
    )
