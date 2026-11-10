from engine.enums.agent_role import AgentRole
from engine.enums.helper_role import HelperRole
from core.base.change.created import Created
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.report_nudges import PARENT_REPORT_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.agents.support.agent_rows import AgentRows


class NewMainHelpersListener(SaveListener[Created[Agent]]):
    """A new main session takes over the open helpers whose parent ended and the report lines left on ended main
    sessions, so no report waits on a row nobody reads."""

    name = "helpers.new-main-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, agents: AgentRows, repository: Repository) -> None:
        self.queries, self.agents, self.repository = queries, agents, repository

    def handle(self, event: Created[Agent], context: Context) -> None:
        agent = event.row
        if agent.role != AgentRole.MAIN:
            return
        for helper in self.agents.running(HelperRole.HELPER):
            if helper.parent_id is not None and self.has_ended(helper.parent_id):
                self.repository.save(helper.changed(parent_id=agent.id), context)
        for line in tuple(self.queries.query(AgentLine).filter(source=PARENT_REPORT_SOURCE, state=AgentLineState.WAITING).all_rows()):
            if self.has_ended(line.session_agent_id):
                self.repository.save(line.changed(session_agent_id=agent.id), context)

    def has_ended(self, agent_id: int) -> bool:
        return self.queries.query(Agent).find(agent_id).ended_at is not None
