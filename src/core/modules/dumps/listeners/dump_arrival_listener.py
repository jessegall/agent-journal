from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.dumps.support.dump_nudges import DUMP_ARRIVED
from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.dumps.models.dump import Dump
from core.modules.agents.support.main_agent_finder import MainAgentFinder

LINE_SOURCE = "dumps.arrival"


class DumpArrivalListener(SaveListener):
    """A new dump gives the environment's main agent the line to file it, at its next hook."""

    name = "dumps.arrival"
    event = "dump.create"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, change: Change[Model]) -> None:
        dump = change.row
        if not isinstance(dump, Dump):
            return
        for agent in MainAgentFinder.rows(self.queries, dump.environment_id):
            self.nudger.send(agent.id, DUMP_ARRIVED, LINE_SOURCE, change.context, dump=dump.id)
