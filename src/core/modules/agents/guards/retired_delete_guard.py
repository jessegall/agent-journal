from engine.actor.actor import Actor
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


class RetiredDeleteGuard(Guard[Deleted[Agent]]):
    """An agent's record stays: no user and no agent deletes it, and only a retirement ends an agent for good.
    The journal itself still removes the row of an agent that never started."""

    name = "agents.retired-delete"
    is_safety = True

    def check(self, event: Deleted[Agent], context: Context) -> None:
        label = AgentLabel.from_agent(event.row).text
        if event.row.retired_at is not None:
            raise Refusal(f"{label} is retired, and its record stays")
        if context.actor != Actor.core():
            raise Refusal(f"{label} is not deleted: its record stays", f'journal agent retire {event.row.number} --reason "<why>" retires it')
