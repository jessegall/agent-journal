from core.base.change.deleted import Deleted
from core.base.command.context import Context
from core.base.guard.guard import Guard
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent


class RetiredDeleteGuard(Guard[Deleted[Agent]]):
    """A retired agent's record stays."""

    name = "agents.retired-delete"
    is_safety = True

    def check(self, event: Deleted[Agent], context: Context) -> None:
        if event.row.retired_at is not None:
            raise Refusal(f"agent {event.row.id} is retired, and its record stays")
