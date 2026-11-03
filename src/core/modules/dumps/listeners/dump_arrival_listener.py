from core.modules.dumps.support.dump_nudges import DUMP_ARRIVED
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.dumps.models.dump import Dump
from core.modules.agents.support.main_agent_finder import MainAgentFinder

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
        for agent in MainAgentFinder.rows(self.queries, dump.environment_id):
            self.repository.save(AgentLine(agent_id=agent.id, creator_id=change.context.actor.id, text=DUMP_ARRIVED.nudge(dump=dump.id).text, source=LINE_SOURCE), change.context)
