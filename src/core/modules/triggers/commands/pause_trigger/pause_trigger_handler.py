from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.triggers.commands.pause_trigger.pause_trigger import PauseTrigger
from core.modules.triggers.models.trigger import Trigger


class PauseTriggerHandler(Handler[PauseTrigger, Trigger]):
    """Keeps when a trigger was paused, or clears it."""

    command = PauseTrigger

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: PauseTrigger, context: Context) -> Trigger:
        trigger = self.queries.query(Trigger).find(command.trigger_id)
        return self.repository.update(trigger, context, paused_at=context.timestamp if command.is_paused else None)
