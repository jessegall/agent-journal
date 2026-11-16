from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.created import Created
from engine.guard.guard import Guard
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.pins.models.pin import Pin


class SameLinkPinGuard(Guard[Created[Pin]]):
    """A pin whose link an open pin of the same environment already shows is refused, so the chat docks one button
    per link; a skip with a reason lets a second one through."""

    name = "pins.same-link"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, event: Created[Pin], context: Context) -> None:
        pin = event.row
        shown = self.queries.query(Pin).filter(link=pin.link).matching(IsNull("closed_at")).first()
        if shown is not None and shown.id != pin.id:
            raise Refusal(f"pin {shown.id} already shows {pin.link}", "use that pin, or close it first")
