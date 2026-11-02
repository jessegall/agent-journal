from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.record_check_progress.record_check_progress import RecordCheckProgress
from suites.coding.modules.checks.models.check import Check


class RecordCheckProgressHandler(Handler[RecordCheckProgress, Check]):
    """Keeps a running check's percent on its row, so the viewer's bar follows it."""

    command = RecordCheckProgress

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RecordCheckProgress, context: Context) -> Check:
        return self.repository.save(replace(self.queries.query(Check).find(command.check_id), run_percent=command.percent), context)
