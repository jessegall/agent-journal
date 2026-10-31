from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from suites.coding.modules.checks.commands.make_check import MakeCheck
from suites.coding.modules.checks.models.check import Check


class MakeCheckHandler(Handler[MakeCheck, Check]):
    """Saves a new check, not run yet."""

    command = MakeCheck

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeCheck, context: Context) -> Check:
        return self.repository.save(Check(creator_id=context.actor.id, title=command.title, command=command.command, brief=command.brief, interval_minutes=command.interval_minutes), context)
