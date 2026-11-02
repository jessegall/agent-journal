from core.base.metadata import Metadata
from core.modules.messages.support.message_reactions import MessageReactions
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.support.message_files import MessageFiles
from core.modules.messages.support.message_module import MESSAGES_MODULE


ACTOR_MESSAGE_TYPES = {ActorType.USER: MessageType.USER, ActorType.AGENT: MessageType.AGENT}


class SendMessageHandler(Handler[SendMessage, Message]):
    """Saves a message from the caller: a person's is a user message, an agent's an agent message,
    anything else the journal's."""

    command = SendMessage

    def __init__(self, repository: Repository, files: MessageFiles, queries: Queries) -> None:
        self.repository, self.files, self.queries = repository, files, queries

    def handle(self, command: SendMessage, context: Context) -> Message:
        if command.parent_id is not None and context.actor.type is ActorType.AGENT and MessageReactions.is_emoji(command.text):
            raise Refusal(f"a reply of only {command.text} is not posted", f'react instead: journal message react {command.parent_id} "{command.text}"')
        actor = context.actor
        environment_id = self.queries.query(Message).find(command.parent_id).environment_id if command.parent_id is not None else context.environment_id
        if environment_id is None:
            raise Refusal("a message is sent in an environment", "name it with --environment")
        names = self.files.check(command.files)
        message_type = ACTOR_MESSAGE_TYPES.get(actor.type, MessageType.JOURNAL)
        metadata = Metadata({MESSAGES_MODULE: {"commented_row": {"model": command.commented_row[0], "id": command.commented_row[1]}}}) if command.commented_row else Metadata()
        message = Message(environment_id=environment_id, agent_id=actor.id if actor.type is ActorType.AGENT else None,
                          parent_id=command.parent_id, creator_id=actor.id, type=MessageType.COMMENT if command.commented_row and message_type is MessageType.USER else message_type,
                          text=command.text, files=names, metadata=metadata)
        saved = self.repository.save(message, context)
        self.files.adopt(saved.id, command.files)
        return saved
