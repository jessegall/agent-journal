from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.agent_role import AgentRole
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent


class ProgramChangeAccess:
    """Allows a user or main agent to change how agent programs are assigned, and the program of one agent;
    no agent changes its own."""

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, actor: Actor) -> None:
        if actor.type is not ActorType.AGENT:
            return
        agent = self.rows.required(Agent, actor.id)
        if agent.role != AgentRole.MAIN:
            raise Refusal(f"a {agent.role} cannot change program settings", "ask the main agent")

    def check_driver_change(self, actor: Actor, agent: Agent) -> None:
        if not actor.is_agent():
            return
        if actor.id == agent.id:
            raise Refusal("an agent does not change its own driver", "ask the user")
        if not self.rows.required(Agent, actor.id).is_main:
            raise Refusal("only a user or the main agent changes a driver", "ask the main agent")
