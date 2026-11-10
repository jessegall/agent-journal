from engine.enums.actor_type import ActorType
from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.models.message import Message
from suites.coding.modules.workers.support.merger_nudges import MERGER_PROFILE
from suites.coding.support.coding_helper_role import CodingHelperRole


class MergerMessageGuard(Guard[Created[Message]]):
    """The merger talks to a worker only through advice, which is counted; any other message to a worker is refused."""

    name = "workers.merger-message"

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, event: Created[Message], context: Context) -> None:
        receiver_id = event.row.target_agent_id
        if receiver_id is None or context.actor.type is not ActorType.AGENT or self.is_counted(context):
            return
        if self.agents.find(context.actor.id).profile == MERGER_PROFILE and self.agents.find(receiver_id).role == CodingHelperRole.WORKER:
            raise Refusal("the merger talks to a worker only through advise", 'journal merger advise <worker> "<text>" (five per group)')

    @staticmethod
    def is_counted(context: Context) -> bool:
        return isinstance(context.command, SendAgentMessage) and context.command.is_counted
