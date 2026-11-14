from dataclasses import replace

from engine.command.person_check import PersonCheck
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from suites.coding.modules.checks.commands.start_check.start_check import StartCheck
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class StartCheckHandler(Handler[StartCheck, Check]):
    """Marks a stopped check as running again; only a user starts a check."""

    command = StartCheck

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: StartCheck, context: Context) -> Check:
        PersonCheck.require(context, f"Start the stopped check {command.check_id}?")
        check = self.checks.find(command.check_id)
        if not check.stopped:
            raise Refusal(f"check {check.id} is not stopped", "journal check list shows which checks are stopped")
        return self.repository.save(replace(check, stopped=False), context)
