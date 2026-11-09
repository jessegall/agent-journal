from core.base.database.migration import Migration


class DropWorkerTestRequestsMigration(Migration):
    """Removes the table of one-time test requests: a helper grant says what a worker may run."""

    number = 58
    statements = tuple(["DROP TABLE worker_test_requests"])
