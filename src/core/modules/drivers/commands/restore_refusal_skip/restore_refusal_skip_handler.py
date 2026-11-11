from engine.command.errors.user_approval_refusal import UserApprovalRefusal
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.commands.restore_refusal_skip.restore_refusal_skip import RestoreRefusalSkip
from core.modules.drivers.models.refusal_skip import RefusalSkip
from core.modules.agents.support.agent_label import AgentLabel


class RestoreRefusalSkipHandler(Handler[RestoreRefusalSkip, RefusalSkip]):
    """A person gives any agent its skip back; a main agent only the agents it started."""

    command = RestoreRefusalSkip

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: RestoreRefusalSkip, context: Context) -> RefusalSkip:
        agent = self.queries.query(Agent).find(command.agent_id)
        if agent.is_foreign_helper(context.actor):
            raise UserApprovalRefusal(f"Restore the refusal skip for {AgentLabel.from_agent(agent).text}?", command=command)
        skip = self.queries.query(RefusalSkip).filter(session_agent_id=agent.id).newest().first()
        if skip is None:
            raise Refusal(f"{AgentLabel.from_agent(agent).text} has skipped no refusal")
        return self.repository.update(skip, context, restored_at=context.timestamp)
