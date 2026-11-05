from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.record_check_progress.record_check_progress import RecordCheckProgress
from suites.coding.modules.checks.models.check import Check


class RecordCheckProgressHandler(Handler[RecordCheckProgress, Check]):
    """Keeps a running check's percent on its row, so the viewer's bar follows it."""

    command = RecordCheckProgress

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: RecordCheckProgress, context: Context) -> Check:
        return self.repository.update(self.rows.required(Check, command.check_id), context, run_percent=command.percent)
