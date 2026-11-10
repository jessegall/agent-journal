from engine.enums.agent_role import AgentRole
from engine.enums.helper_role import HelperRole
from engine.event.created import Created
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.conditions.among import Among
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.report_nudges import PARENT_REPORT_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from core.modules.agents.support.agent_rows import AgentRows


class NewMainHelpersListener(SaveListener[Created[Agent]]):
    """A new main session takes over the open helpers whose parent ended and the report lines left on ended main
    sessions of its environment, so no report waits on a row nobody reads."""

    name = "helpers.new-main-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, agents: AgentRows, repository: Repository) -> None:
        self.queries, self.agents, self.repository = queries, agents, repository

    def handle(self, event: Created[Agent], context: Context) -> None:
        agent = event.row
        if agent.role != AgentRole.MAIN:
            return
        helpers = [helper for helper in self.agents.running(HelperRole.HELPER) if helper.parent_id is not None]
        lines = tuple(self.queries.query(AgentLine).filter(source=PARENT_REPORT_SOURCE, state=AgentLineState.WAITING).all_rows())
        ended_ids = self.ended_ids({helper.parent_id for helper in helpers} | {line.session_agent_id for line in lines})
        for helper in helpers:
            if helper.parent_id in ended_ids:
                self.repository.save(helper.changed(parent_id=agent.id), context)
        for line in lines:
            if line.session_agent_id in ended_ids:
                self.repository.save(line.changed(session_agent_id=agent.id), context)

    def ended_ids(self, agent_ids: set[int]) -> set[int]:
        if not agent_ids:
            return set()
        ended = self.queries.query(Agent).matching(Among("id", tuple(sorted(agent_ids)))).matching(HasValue("ended_at")).all_rows()
        return {agent.id for agent in ended}
