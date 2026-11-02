from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.record_check_run.record_check_run import RecordCheckRun
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class RecordCheckRunHandler(Handler[RecordCheckRun, Check]):
    """Saves a check's result; a pass clears the report, so a later failure is reported anew."""

    command = RecordCheckRun

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: RecordCheckRun, context: Context) -> Check:
        check = self.checks.find(command.check_id)
        return self.repository.save(replace(check, last_passed=command.passed, last_output=command.output, last_run_at=context.timestamp, run_percent=None,
                                            reported_at=None if command.passed else check.reported_at), context)
