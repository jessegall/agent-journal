from core.base.actor_type import ActorType
from core.base.change.created import Created
from core.base.command.context import Context
from core.base.guard.guard import Guard
from engine.errors.refusal import Refusal
from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.repeated_messages import RepeatedMessages


class RepeatedMessageGuard(Guard[Created[Message]]):
    """An agent's message that says much the same as one of its last five is held until it confirms that it
    means to send it again; text the journal records from the agent's transcript is never held, since it
    was already said, nor a helper's report that ends its job, since holding it would leave the job open."""

    name = "messages.repeated-message"
    short_flag = "confirm"

    def __init__(self, repeats: RepeatedMessages) -> None:
        self.repeats = repeats

    def check(self, event: Created[Message], context: Context) -> None:
        message = event.row
        if message.type is not MessageType.AGENT or context.actor.type is not ActorType.AGENT or self.ends_job(context):
            return
        repeated = self.repeats.repeated(message.creator_id, message.text, message.id)
        if repeated is not None:
            raise Refusal(f"this is much the same as your message {repeated.id}", "leave it out, or send it anyway with a reason if it adds something new")

    @staticmethod
    def ends_job(context: Context) -> bool:
        return isinstance(context.command, SendAgentMessage) and context.command.ends_job
