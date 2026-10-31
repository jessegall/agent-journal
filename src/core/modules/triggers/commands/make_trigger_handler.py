from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.triggers.commands.make_trigger import MakeTrigger
from core.modules.triggers.models.trigger import Trigger


class MakeTriggerHandler(Handler[MakeTrigger, Trigger]):
    """Saves a new phrase trigger."""

    command = MakeTrigger

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakeTrigger, context: Context) -> Trigger:
        if not command.phrases:
            raise Refusal("a trigger needs a phrase", "give them as 'deploy, release'")
        return self.repository.save(Trigger(creator_id=context.actor.id, phrases=tuple(command.phrases), action=command.action, text=command.text), context)
