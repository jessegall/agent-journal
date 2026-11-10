from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
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
