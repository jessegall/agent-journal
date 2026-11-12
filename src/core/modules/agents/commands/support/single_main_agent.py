from dataclasses import replace

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.database.actor_table import ActorTable
from engine.errors.refusal import Refusal
from engine.enums.agent_role import AgentRole
from engine.command.bus import Bus
from engine.command.context import Context
from engine.scope.scopes import Scopes
from core.modules.agents.commands.end_replaced_main.end_replaced_main import EndReplacedMain
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.agents.support.agent_sessions import AgentSessions


class SingleMainAgent:
    """Keeps one main agent to an environment: a main session that opens ends the one that runs there.
    Only a person, the launcher or the journal replaces a running main agent this way; an agent that
    registers a main agent beside a running one is refused, outside a test environment granted to it, so it
    can never end a person's own."""

    def __init__(self, agents: AgentRows, scopes: Scopes, bus: Bus, actors: ActorTable, sessions: AgentSessions) -> None:
        self.agents, self.scopes, self.bus, self.actors, self.sessions = agents, scopes, bus, actors, sessions

    def end(self, agent: Agent, context: Context) -> None:
        if agent.role != AgentRole.MAIN:
            return
        with self.scopes.opened(None, agent.environment_id):
            existing_agents = [main for main in self.agents.running_main_agents() if main.id != agent.id]
        for main in existing_agents:
            self.ended_session(main, context)

    def ended_session(self, main: Agent, context: Context) -> Agent:
        if self.is_agent_without_grant(context, main.environment_id):
            raise Refusal(f"main agent {main.id} runs in this environment, and an agent does not replace it", "a person or the launcher starts a new main agent")
        self.sessions.ended(main.id, EndReason.PERSON_REPLACEMENT, context)
        return self.bus.dispatch(EndReplacedMain(main.id), replace(context, actor=Actor.core(), environment_id=main.environment_id))

    def is_agent_without_grant(self, context: Context, environment_id: int) -> bool:
        return context.actor.type is ActorType.AGENT and not self.actors.is_granted_test_environment(context.actor.id, environment_id)
