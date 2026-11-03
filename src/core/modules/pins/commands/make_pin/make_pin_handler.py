from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.pins.commands.make_pin.make_pin import MakePin
from core.modules.pins.models.pin import Pin


class MakePinHandler(Handler[MakePin, Pin]):
    """Saves a new pin in the caller's environment."""

    command = MakePin

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakePin, context: Context) -> Pin:
        if context.environment_id is None:
            raise Refusal("a pin is pinned above one environment's chat", "name it with --environment")
        return self.repository.save(Pin(environment_id=context.environment_id, creator_id=context.actor.id, title=command.title, link=command.link,
                                           label=command.button_label), context)
