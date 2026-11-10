from engine.change.deleted import Deleted
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent


class RetiredDeleteGuard(Guard[Deleted[Agent]]):
    """A retired agent's record stays."""

    name = "agents.retired-delete"
    is_safety = True

    def check(self, event: Deleted[Agent], context: Context) -> None:
        if event.row.retired_at is not None:
            raise Refusal(f"agent {event.row.id} is retired, and its record stays")
