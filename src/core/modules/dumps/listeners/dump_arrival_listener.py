from core.base.scope.actor_scope import ActorScope
from core.modules.drivers.support.nudger import Nudger
from core.modules.dumps.support.dump_nudges import DUMP_ARRIVED
from core.base.listener.save_listener import SaveListener
from core.modules.dumps.models.dump import Dump
from core.modules.agents.support.agent_rows import AgentRows
from core.base.change.created import Created
from core.base.command.context import Context

LINE_SOURCE = "dumps.arrival"


class DumpArrivalListener(SaveListener[Created[Dump]]):
    """A new dump gives the environment's main agent the line to file it, at its next hook."""

    name = "dumps.arrival"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, nudger: Nudger) -> None:
        self.agents, self.nudger = agents, nudger

    def handle(self, event: Created[Dump], context: Context) -> None:
        dump = event.row
        for agent in self.agents.running_main_agents():
            self.nudger.send(agent.id, DUMP_ARRIVED, LINE_SOURCE, context, dump=dump.id)
