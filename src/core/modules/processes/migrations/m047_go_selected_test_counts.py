from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import GO_TEST_COUNT_COMMAND


class GoSelectedTestCountsMigration(Migration):
    """Counts only the tests selected by a Go run's pattern."""

    number = 47
    statements = [f"UPDATE readers SET count_command = {quoted(GO_TEST_COUNT_COMMAND)} WHERE name = 'go-test' AND creator_id = 1"]
