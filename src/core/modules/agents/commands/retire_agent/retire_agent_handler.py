from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.agent_roster import AgentRoster
from engine.enums.agent_role import AgentRole
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.container import Container
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.base.registry.registry import Registry
from core.base.repository.repository import Repository
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_roster_check import is_agent_roster


class RetireAgentHandler(Handler[RetireAgent, Agent]):
    """Retires an agent that has ended and holds nothing. Its parent, the main agent of its environment and a person
    may do it, and the suite that owns the agent's type says what still holds it."""

    command = RetireAgent

    def __init__(self, queries: Queries, repository: Repository, registry: Registry, container: Container) -> None:
        self.queries, self.repository, self.registry, self.container = queries, repository, registry, container

    def prepare(self, command: RetireAgent, actor: Actor) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        self.check_actor(agent, actor, command)
        self.check_state(agent, command.reason)
        roster = self.roster(agent)
        if roster is None:
            return
        block = roster.retire_block(agent)
        if block:
            raise Refusal(block)
        roster.release(agent, actor)

    def handle(self, command: RetireAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        self.check_state(agent, command.reason)
        roster = self.roster(agent)
        if roster is not None:
            roster.release_pending_work(agent, context)
        return self.repository.save(agent.retired(context.timestamp, command.reason.strip(), context.actor.id), context)

    def check_actor(self, agent: Agent, actor: Actor, command: RetireAgent) -> None:
        if actor.type is not ActorType.AGENT:
            return
        caller = self.queries.query(Agent).find(actor.id)
        if caller.id != agent.parent_id and (caller.role != AgentRole.MAIN or caller.environment_id != agent.environment_id):
            raise UserApprovalRefusal(f"Retire agent {agent.id}, which belongs to agent {agent.parent_id}?", command=command)

    def check_state(self, agent: Agent, reason: str) -> None:
        if not reason.strip():
            raise Refusal("a retirement needs its reason", f'journal agent retire {agent.id} --reason "<why>"')
        if agent.role == AgentRole.MAIN:
            raise Refusal("a main agent is not retired", f"journal agent stop {agent.id} ends its session")
        if agent.retired_at is not None:
            raise Refusal(f"agent {agent.id} is retired already")
        if agent.ended_at is None:
            raise Refusal(f"agent {agent.id} is still running", f"journal agent stop {agent.id}, then retire it")

    def roster(self, agent: Agent) -> AgentRoster[Agent] | None:
        entry = next((entry for entry in self.registry.helper_types if entry.key == agent.role), None)
        if entry is None or entry.roster is None:
            return None
        roster: object = self.container.get(entry.roster.loaded())
        return roster if is_agent_roster(roster) else None
