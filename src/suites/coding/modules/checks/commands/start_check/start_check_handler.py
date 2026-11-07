from dataclasses import replace

from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.start_check.start_check import StartCheck
from suites.coding.modules.checks.commands.support.kept_checks import KeptChecks
from suites.coding.modules.checks.models.check import Check


class StartCheckHandler(Handler[StartCheck, Check]):
    """Marks a stopped check as running again; only a person starts a check."""

    command = StartCheck

    def __init__(self, checks: KeptChecks, repository: Repository) -> None:
        self.checks, self.repository = checks, repository

    def handle(self, command: StartCheck, context: Context) -> Check:
        if context.actor.type is not ActorType.USER:
            raise Refusal("only a person starts a stopped check", "ask the user to start it on the Checks window")
        check = self.checks.find(command.check_id)
        if not check.stopped:
            raise Refusal(f"check {check.id} is not stopped", "journal check list shows which checks are stopped")
        return self.repository.save(replace(check, stopped=False), context)
