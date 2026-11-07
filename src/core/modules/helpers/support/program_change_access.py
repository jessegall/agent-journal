from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent


class ProgramChangeAccess:
    """Allows a person or main agent to change how agent programs are assigned."""

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, actor: Actor) -> None:
        if actor.type is not ActorType.AGENT:
            return
        agent = self.rows.required(Agent, actor.id)
        if agent.role != AgentRole.MAIN:
            raise Refusal(f"a {agent.role} cannot change program settings", "ask the main agent")
