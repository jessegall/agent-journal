from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.database.actor_table import ActorTable
from engine.errors.refusal import Refusal
from engine.enums.agent_role import AgentRole
from engine.command.bus import Bus
from engine.command.context import Context
from engine.scope.scopes import Scopes
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows


class SingleMainAgent:
    """Keeps one main agent to an environment: an agent that opens as main ends every other that runs there.
    Only a person, the launcher or the journal replaces a running main agent this way; an agent that
    registers a main agent beside a running one is refused, outside a test environment granted to it, so it
    can never end a person's own."""

    def __init__(self, agents: AgentRows, scopes: Scopes, bus: Bus, actors: ActorTable) -> None:
        self.agents, self.scopes, self.bus, self.actors = agents, scopes, bus, actors

    def end(self, agent: Agent, context: Context) -> None:
        if agent.role != AgentRole.MAIN:
            return
        with self.scopes.opened(None, agent.environment_id):
            existing_agents = [main for main in self.agents.running_main_agents() if main.id != agent.id]
        if existing_agents and self.is_agent_without_grant(context, agent.environment_id):
            raise Refusal(f"main agent {existing_agents[0].id} runs in this environment, and an agent does not replace it", "a person or the launcher starts a new main agent")
        for main in existing_agents:
            self.bus.dispatch(EndReplacedMain(main.id), replace(context, actor=Actor.core(), environment_id=agent.environment_id))

    def is_agent_without_grant(self, context: Context, environment_id: int) -> bool:
        return context.actor.type is ActorType.AGENT and not self.actors.is_granted_test_environment(context.actor.id, environment_id)
