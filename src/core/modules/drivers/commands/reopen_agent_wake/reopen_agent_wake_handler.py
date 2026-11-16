from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.commands.reopen_agent_wake.reopen_agent_wake import ReopenAgentWake
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState


class ReopenAgentWakeHandler(Handler[ReopenAgentWake, AgentWake]):
    """A claimed wake whose transport failed is open again for the owner's next round, with the failure kept."""

    command = ReopenAgentWake

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ReopenAgentWake, context: Context) -> AgentWake:
        wake = self.queries.query(AgentWake).find(command.wake_id)
        if wake.state is not WakeState.CLAIMED:
            return wake
        return self.repository.update(wake, context, state=WakeState.OPEN, lease_ends_at=None, failure=command.failure)
