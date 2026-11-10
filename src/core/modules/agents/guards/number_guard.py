from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.updated import Updated
from engine.guard.guard import Guard
from core.modules.agents.models.agent import Agent


class NumberGuard(Guard[Updated[Agent]]):
    """An agent's number is given when the agent is made and never changes afterwards."""

    name = "agents.number"
    is_safety = True

    def check(self, event: Updated[Agent], context: Context) -> None:
        if event.old_row is not None and event.old_row.number != event.row.number:
            raise Refusal("numbers are only given", "an agent keeps the number it was made with")
