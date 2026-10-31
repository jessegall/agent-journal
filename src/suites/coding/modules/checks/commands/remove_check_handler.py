from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.remove_check import RemoveCheck
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class RemoveCheckHandler(Handler[RemoveCheck, Check]):
    """Marks a check that is not removed as removed."""

    command = RemoveCheck

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: RemoveCheck, context: Context) -> Check:
        return self.repository.save(replace(self.checks.find(command.check_id), removed_at=context.timestamp), context)
