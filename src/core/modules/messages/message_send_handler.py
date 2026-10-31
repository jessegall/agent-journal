from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.message_send import MessageSend
from core.modules.messages.message import Message
from core.modules.messages.message_type import MessageType


ACTOR_MESSAGE_TYPES = {ActorType.USER: MessageType.USER, ActorType.AGENT: MessageType.AGENT}


class MessageSendHandler(Handler[MessageSend, Message]):
    """Saves a message from the caller: a person's is a user message, an agent's an agent message, anything else
    the journal's."""

    command = MessageSend

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: MessageSend, context: Context) -> Message:
        actor = context.actor
        if context.environment_id is None:
            raise Refusal("a message is sent in an environment", "name it with --environment")
        message = Message(environment_id=context.environment_id, agent_id=actor.id if actor.type is ActorType.AGENT else None,
                          parent_id=command.parent_id, creator_id=actor.id, type=ACTOR_MESSAGE_TYPES.get(actor.type, MessageType.JOURNAL),
                          text=command.text)
        return self.repository.save(message, context)
