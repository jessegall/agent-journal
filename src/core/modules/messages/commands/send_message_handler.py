from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.send_message import SendMessage
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.support.message_files import MessageFiles


ACTOR_MESSAGE_TYPES = {ActorType.USER: MessageType.USER, ActorType.AGENT: MessageType.AGENT}


class SendMessageHandler(Handler[SendMessage, Message]):
    """Saves a message from the caller: a person's is a user message, an agent's an agent message,
    anything else the journal's."""

    command = SendMessage

    def __init__(self, repository: Repository, files: MessageFiles) -> None:
        self.repository, self.files = repository, files

    def handle(self, command: SendMessage, context: Context) -> Message:
        actor = context.actor
        if context.environment_id is None:
            raise Refusal("a message is sent in an environment", "name it with --environment")
        names = self.files.check(command.files)
        message = Message(environment_id=context.environment_id, agent_id=actor.id if actor.type is ActorType.AGENT else None,
                          parent_id=command.parent_id, creator_id=actor.id, type=ACTOR_MESSAGE_TYPES.get(actor.type, MessageType.JOURNAL),
                          text=command.text, files=names)
        saved = self.repository.save(message, context)
        self.files.adopt(saved.id, command.files)
        return saved
