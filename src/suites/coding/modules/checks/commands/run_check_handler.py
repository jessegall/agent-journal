from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.run_check import RunCheck
from suites.coding.modules.checks.commands.support.check_runner import CheckRunner
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class RunCheckHandler(Handler[RunCheck, Check]):
    """Runs a check that is not removed or stopped; a pass clears the report, so a later failure is reported anew."""

    command = RunCheck

    def __init__(self, checks: KeptChecks, runner: CheckRunner, repository: Repository) -> None:
        self.checks, self.runner, self.repository = checks, runner, repository

    def handle(self, command: RunCheck, context: Context) -> Check:
        check = self.checks.find(command.check_id)
        if check.stopped:
            raise Refusal(f"check {check.id} is stopped", "journal check remove ends it")
        outcome = self.runner.run(check.command)
        return self.repository.save(replace(check, last_passed=outcome.passed, last_output=outcome.output, last_run_at=context.timestamp,
                                            reported_at=None if outcome.passed else check.reported_at), context)
