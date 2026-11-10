from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.pins.commands.make_pin.make_pin import MakePin
from core.modules.pins.models.pin import Pin


class MakePinHandler(Handler[MakePin, Pin]):
    """Saves a new pin in the caller's environment."""

    command = MakePin

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MakePin, context: Context) -> Pin:
        return self.repository.save(Pin(creator_id=context.actor.id, title=command.title, link=command.link,
                                           label=command.button_label), context)
