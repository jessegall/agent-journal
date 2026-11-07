from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import insert, quoted
from core.modules.processes.support.stock_reader import STOCK_READERS

NEW_READERS = ("make", "gcc", "cmake", "ruby-minitest", "rspec", "mix-test", "bun-test", "swift-test", "swift-build", "dotnet-build", "maven", "gradle", "webpack", "php-lint", "mypy", "ruff")
FIXED_READERS = ("dotnet-test", "phpunit", "docker-build")


class MoreStockReadersMigration(Migration):
    """Adds the stock readers of more languages and build tools, leaving a project's reader of the same name alone,
    and brings the stock readers the fixture outputs found wanting up to date."""

    number = 34
    statements = tuple(insert(reader).replace("INSERT INTO", "INSERT OR IGNORE INTO") for reader in STOCK_READERS if reader.name in NEW_READERS) + tuple(
        f"UPDATE readers SET lines_pattern = {quoted(reader.lines)}, progress_pattern = {quoted(reader.progress)}, finished_pattern = {quoted(reader.finished)}, failed_pattern = {quoted(reader.failed)}, "
        f"summary_pattern = {quoted(reader.summary)}, count_pattern = {quoted(reader.count)}, step_pattern = {quoted(reader.step)} WHERE name = {quoted(reader.name)} AND creator_id = 1"
        for reader in STOCK_READERS if reader.name in FIXED_READERS
    )
