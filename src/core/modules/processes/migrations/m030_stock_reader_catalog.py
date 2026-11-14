from engine.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import insert, quoted
from core.modules.processes.support.stock_reader import STOCK_READERS


class StockReaderCatalogMigration(Migration):
    number = 30
    readers = tuple(reader for reader in STOCK_READERS if reader.name in ("npm-build", "npm-install", "pyright", "go-test", "go-build", "go-vet", "tsc", "eslint", "pip-install", "cargo-build", "cargo-test", "cargo-nextest", "docker-build", "jest"))
    statements = tuple(insert(reader).replace("INSERT INTO", "INSERT OR IGNORE INTO") for reader in readers) + tuple(
        f"UPDATE readers SET count_pattern = {quoted(reader.count)}, count_command = {quoted(reader.count_command)}, "
        f"step_pattern = {quoted(reader.step)} WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in readers
    )
