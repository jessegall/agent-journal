from core.base.database.migration import Migration
from core.modules.processes.models.support.views import PROCESS_QUEUE_ROWS_SELECT


class ProcessQueueVisibilityMigration(Migration):
    """Replaces the queue view with queue members and main-agent tests and builds."""

    number = 42
    statements = ["DROP VIEW IF EXISTS process_queue_rows", f"CREATE VIEW process_queue_rows AS {PROCESS_QUEUE_ROWS_SELECT}"]
