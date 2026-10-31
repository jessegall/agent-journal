from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.edit_check import EditCheck
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class EditCheckHandler(Handler[EditCheck, Check]):
    """Changes a check that is not removed."""

    command = EditCheck

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: EditCheck, context: Context) -> Check:
        check = self.checks.find(command.check_id)
        return self.repository.save(replace(check, title=command.title if command.title is not None else check.title,
                                            command=command.command if command.command is not None else check.command,
                                            brief=command.brief if command.brief is not None else check.brief,
                                            interval_minutes=command.interval_minutes if command.interval_minutes is not None else check.interval_minutes), context)
