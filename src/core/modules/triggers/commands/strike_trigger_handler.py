from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.triggers.commands.strike_trigger import StrikeTrigger
from core.modules.triggers.models.trigger import Trigger


class StrikeTriggerHandler(Handler[StrikeTrigger, Trigger]):
    """Ends an open trigger."""

    command = StrikeTrigger

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: StrikeTrigger, context: Context) -> Trigger:
        trigger = self.queries.query(Trigger).find(command.trigger_id)
        if trigger.ended_at is not None:
            raise Refusal(f"trigger {trigger.id} is struck already", "journal trigger list shows the open ones")
        return self.repository.save(replace(trigger, ended_at=context.timestamp), context)
