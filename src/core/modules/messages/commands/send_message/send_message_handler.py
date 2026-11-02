from core.base.metadata import Metadata
from core.modules.messages.support.message_reactions import MessageReactions
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.support.message_files import MessageFiles


MESSAGES_MODULE = "journal.core.messages"
ACTOR_MESSAGE_TYPES = {ActorType.USER: MessageType.USER, ActorType.AGENT: MessageType.AGENT}


class SendMessageHandler(Handler[SendMessage, Message]):
    """Saves a message from the caller: a person's is a user message, an agent's an agent message,
    anything else the journal's."""

    command = SendMessage

    def __init__(self, repository: Repository, files: MessageFiles) -> None:
        self.repository, self.files = repository, files

    def handle(self, command: SendMessage, context: Context) -> Message:
        if command.parent_id is not None and context.actor.type is ActorType.AGENT and MessageReactions.is_emoji(command.text):
            raise Refusal(f"a reply of only {command.text} is not posted", f'react instead: journal message react {command.parent_id} "{command.text}"')
        actor = context.actor
        if context.environment_id is None:
            raise Refusal("a message is sent in an environment", "name it with --environment")
        names = self.files.check(command.files)
        message_type = ACTOR_MESSAGE_TYPES.get(actor.type, MessageType.JOURNAL)
        metadata = Metadata({MESSAGES_MODULE: {"comment_on": {"model": command.comment_on[0], "id": command.comment_on[1]}}}) if command.comment_on else Metadata()
        message = Message(environment_id=context.environment_id, agent_id=actor.id if actor.type is ActorType.AGENT else None,
                          parent_id=command.parent_id, creator_id=actor.id, type=MessageType.COMMENT if command.comment_on and message_type is MessageType.USER else message_type,
                          text=command.text, files=names, metadata=metadata)
        saved = self.repository.save(message, context)
        self.files.adopt(saved.id, command.files)
        return saved
