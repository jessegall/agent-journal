from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.triggers.commands.enable_trigger.enable_trigger import EnableTrigger
from core.modules.triggers.models.trigger import Trigger


class EnableTriggerHandler(Handler[EnableTrigger, Trigger]):
    """Clears a trigger's wait for the user; the guard on triggers refuses an agent."""

    command = EnableTrigger

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: EnableTrigger, context: Context) -> Trigger:
        return self.repository.update(self.queries.query(Trigger).find(command.trigger_id), context, needs_enabling=False)
