from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.updated import Updated
from engine.guard.guard import Guard
from core.modules.agents.models.agent import Agent


class NumberGuard(Guard[Updated[Agent]]):
    """Refuses an update that changes the number of an agent."""

    name = "agents.number"
    is_safety = True

    def check(self, event: Updated[Agent], context: Context) -> None:
        if event.old_row is not None and event.old_row.number != event.row.number:
            raise Refusal("the number of an agent cannot be changed", "an agent has the number it was made with")
