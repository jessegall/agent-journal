from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.driver_nudges import AGENT_RESUMED
from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.user_approval_refusal import UserApprovalRefusal
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.resume_agent.resume_agent import ResumeAgent
from core.modules.drivers.listeners.typed_line_listener import RESUME_SOURCE
from core.modules.drivers.support.nudger import Nudger



class ResumeAgentHandler(Handler[ResumeAgent, Agent]):
    """Clears a paused agent's pause and leaves the line that it may carry on, which a listener types once
    this is committed."""

    command = ResumeAgent
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def handle(self, command: ResumeAgent, context: Context) -> Agent:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.paused_at is None:
            raise Refusal(f"agent {agent.id} is not paused")
        helpers = self.queries.query(Agent).filter(parent_id=agent.id).all_rows()
        if context.approval_id is None and context.actor.id in (agent.id, *(helper.id for helper in helpers)):
            raise UserApprovalRefusal(f"Resume the paused agent {agent.id}?", command=command)
        resumed =self.repository.save(replace(agent, paused_at=None), context)
        self.nudger.send(agent.id, AGENT_RESUMED, RESUME_SOURCE, context)
        return resumed
