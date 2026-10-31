from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.stop_check import StopCheck
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class StopCheckHandler(Handler[StopCheck, Check]):
    """Marks a check that is not removed as stopped."""

    command = StopCheck

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: StopCheck, context: Context) -> Check:
        return self.repository.save(replace(self.checks.find(command.check_id), stopped=True), context)
