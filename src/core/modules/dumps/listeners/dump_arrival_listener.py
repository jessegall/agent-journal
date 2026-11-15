from engine.scope.actor_scope import ActorScope
from engine.driver.message_sender import MessageSender
from core.modules.dumps.agent_messages.dump_arrived_message import DumpArrivedMessage
from engine.listener.save_listener import SaveListener
from core.modules.dumps.models.dump import Dump
from core.modules.agents.support.agent_rows import AgentRows
from engine.event.created import Created
from engine.command.context import Context

LINE_SOURCE = "dumps.arrival"


class DumpArrivalListener(SaveListener[Created[Dump]]):
    """A new dump gives the environment's main agent the line to file it, at its next hook."""

    name = "dumps.arrival"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, message_sender: MessageSender) -> None:
        self.agents, self.message_sender = agents, message_sender

    def handle(self, event: Created[Dump], context: Context) -> None:
        dump = event.row
        for agent in self.agents.running_main_agents():
            self.message_sender.send(agent.id, DumpArrivedMessage.declared(), LINE_SOURCE, context, dump=dump.id)
