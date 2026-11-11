from engine.actor.actor import Actor
from engine.agent.agent_roster import AgentRoster
from engine.enums.agent_role import AgentRole
from engine.command.context import Context
from engine.command.handler import Handler
from engine.container.container import Container
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.registry.registry import Registry
from engine.repository.repository import Repository
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_roster_check import is_agent_roster
from core.modules.agents.support.agent_label import AgentLabel


class RetireAgentHandler(Handler[RetireAgent, Agent]):
    """Retires an agent that has ended and holds nothing. A person retires it directly; an agent that asks,
    its parent and the main agent included, waits for a person to accept. The suite that owns the agent's
    type says what still holds it."""

    command = RetireAgent

    def __init__(self, queries: Queries, repository: Repository, registry: Registry, container: Container) -> None:
        self.queries, self.repository, self.registry, self.container = queries, repository, registry, container

    def prepare(self, command: RetireAgent, actor: Actor) -> None:
        agent = self.queries.query(Agent).find(command.agent_id)
        self.check_state(agent, command.reason)
        roster = self.roster(agent)
        block = roster.retire_block(agent) if roster is not None else ""
        if block:
            raise Refusal(block)
        if actor.is_agent():
            raise UserApprovalRefusal(f"Retire {AgentLabel.from_agent(agent).text}{self.parent_text(agent)}?", command=command, request_reason=command.reason.strip())
        if roster is not None:
            roster.release(agent, actor)

    def handle(self, command: RetireAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        self.check_state(agent, command.reason)
        roster = self.roster(agent)
        if roster is not None:
            roster.release_pending_work(agent, context)
        return self.repository.save(agent.retired(context.timestamp, command.reason.strip(), context.actor.id), context)

    def parent_text(self, agent: Agent) -> str:
        if agent.parent_id is None:
            return ""
        return f", which belongs to {AgentLabel.from_agent(self.queries.query(Agent).find(agent.parent_id)).text}"

    def check_state(self, agent: Agent, reason: str) -> None:
        if not reason.strip():
            raise Refusal("a retirement needs its reason", f'journal agent retire {agent.number} --reason "<why>"')
        if agent.role == AgentRole.MAIN:
            raise Refusal("a main agent is not retired", f"journal agent stop {agent.number} ends its session")
        if agent.retired_at is not None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} is retired already")
        if agent.ended_at is None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} is still running", f"journal agent stop {agent.number}, then retire it")

    def roster(self, agent: Agent) -> AgentRoster[Agent] | None:
        entry = next((entry for entry in self.registry.helper_types if entry.key == agent.role), None)
        if entry is None or entry.roster is None:
            return None
        roster: object = self.container.get(entry.roster.loaded())
        return roster if is_agent_roster(roster) else None
