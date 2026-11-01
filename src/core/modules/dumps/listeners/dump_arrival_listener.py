from core.base.agent_role import AgentRole
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.models.agent import Agent
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.dumps.models.dump import Dump

LINE_SOURCE = "dumps.arrival"


class DumpArrivalListener(SaveListener):
    """A new dump gives the environment's main agent the line to file it, at its next hook."""

    name = "dumps.arrival"
    event = "dump.create"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        dump = change.row
        if not isinstance(dump, Dump):
            return
        for agent in self.queries.query(Agent).filter(environment_id=dump.environment_id, role=AgentRole.MAIN).matching(IsNull("ended_at")).newest().page(1, 1).rows:
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=change.context.actor.id, text=f"file dump {dump.id}: journal dump items {dump.id}", source=LINE_SOURCE), change.context)
