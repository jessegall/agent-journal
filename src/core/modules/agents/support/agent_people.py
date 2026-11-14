from dataclasses import dataclass

from core.modules.actors.models.actor_record import ActorRecord
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class AgentPeople:
    """Who made a row, as an actor and as the agent it is when it is one, and the agent the row belongs to."""

    actor: ActorRecord | None
    creator_agent: Agent | None
    owner: Agent | None

    def line(self) -> str:
        return f"made by {self.actor.name if self.actor else 'nobody known'}, belongs to {self.owner.display_name if self.owner else 'no agent'}"
