from core.base.agent_role import AgentRole
from core.base.change.created import Created
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.query.conditions.among import Among
from core.base.query.conditions.greater import Greater
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.report_nudges import PARENT_REPORT_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState


class NewMainHelpersListener(SaveListener[Created[Agent]]):
    """A new main session takes over the open helpers whose parent ended and the report lines left on ended main
    sessions, so no report waits on a row nobody reads."""

    name = "helpers.new-main-agent"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Created[Agent], context: Context) -> None:
        agent = event.row
        if agent.role != AgentRole.MAIN:
            return
        ended_ids = tuple(row.id for row in self.queries.query(Agent).filter(role=AgentRole.MAIN).matching(Greater("ended_at", "")).all_rows())
        for helper in tuple(self.queries.query(Agent).filter(role=AgentRole.HELPER).matching(IsNull("ended_at")).matching(Among("parent_id", ended_ids)).all_rows()):
            self.repository.save(helper.changed(parent_id=agent.id), context)
        waiting = self.queries.query(AgentLine).filter(source=PARENT_REPORT_SOURCE, state=AgentLineState.WAITING).matching(Among("session_agent_id", ended_ids))
        for line in tuple(waiting.all_rows()):
            self.repository.save(line.changed(session_agent_id=agent.id), context)
