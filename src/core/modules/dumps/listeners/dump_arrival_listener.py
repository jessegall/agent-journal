from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.dumps.support.dump_nudges import DUMP_ARRIVED
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.dumps.models.dump import Dump
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.base.change.created import Created
from core.base.command.context import Context

LINE_SOURCE = "dumps.arrival"


class DumpArrivalListener(SaveListener[Created[Dump]]):
    """A new dump gives the environment's main agent the line to file it, at its next hook."""

    name = "dumps.arrival"
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, nudger: Nudger) -> None:
        self.queries, self.nudger = queries, nudger

    def handle(self, event: Created[Dump], context: Context) -> None:
        dump = event.row
        environment_id = context.environment_id
        agents = MainAgentFinder.rows(self.queries) if environment_id is not None else MainAgentFinder.all_running(self.queries)
        for agent in agents:
            self.nudger.send(agent.id, DUMP_ARRIVED, LINE_SOURCE, context, dump=dump.id)
