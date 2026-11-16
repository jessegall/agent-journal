from suites.coding.modules.workers.types.worker import Worker
from suites.coding.modules.workers.types.merger import Merger
from engine.enums.actor_type import ActorType
from engine.event.created import Created
from engine.command.context import Context
from engine.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.models.message import Message


class MergeAdviceGuard(Guard[Created[Message]]):
    """The merger talks to a worker only through advice, which is counted; any other message to a worker is refused."""

    name = "workers.merger-message"

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, event: Created[Message], context: Context) -> None:
        receiver_id = event.row.target_agent_id
        if receiver_id is None or context.actor.type is not ActorType.AGENT or self.is_counted(context):
            return
        if self.agents.find(context.actor.agent_id()).role == Merger.key and self.agents.find(receiver_id).role == Worker.key:
            raise Refusal("you talk to a worker only through advise", 'journal merger advise <worker> "<text>" (five between two commits of the worker)')

    @staticmethod
    def is_counted(context: Context) -> bool:
        return isinstance(context.command, SendAgentMessage) and context.command.is_counted
