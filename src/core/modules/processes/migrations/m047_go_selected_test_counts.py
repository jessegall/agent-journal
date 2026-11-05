from core.base.database.migration import Migration
from core.modules.processes.migrations.m003_stock_readers import quoted
from core.modules.processes.support.stock_reader import GOLANG_TEST_LISTING


class GoSelectedTestCountsMigration(Migration):
    """Counts only the tests selected by a Go run's pattern."""

    number = 47
    statements = [f"UPDATE readers SET count_command = {quoted(GOLANG_TEST_LISTING)} WHERE name = 'go-test' AND creator_id = 1"]
