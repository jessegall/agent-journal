from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.pins.commands.close_pin.close_pin import ClosePin
from core.modules.pins.models.pin import Pin
from core.modules.pins.queries.pin_query import PinQuery


class ClosePinHandler(Handler[ClosePin, Pin]):
    """Closes an open pin; one closed already is refused."""

    command = ClosePin

    def __init__(self, pins: PinQuery, repository: Repository) -> None:
        self.pins, self.repository = pins, repository

    def handle(self, command: ClosePin, context: Context) -> Pin:
        pin = self.pins.find(command.pin_id)
        if pin.closed_at is not None:
            raise Refusal(f"pin {pin.id} is closed already", "journal pin list shows the open ones")
        return self.repository.save_change(pin, pin.changed(closed_at=context.timestamp), context)
