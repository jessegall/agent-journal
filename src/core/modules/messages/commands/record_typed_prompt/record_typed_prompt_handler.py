from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.messages.commands.record_typed_prompt.record_typed_prompt import RecordTypedPrompt
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import PROMPT_MESSAGE_KEY, Message


class RecordTypedPromptHandler(Handler[RecordTypedPrompt, Message]):
    """Saves a typed prompt as a user message; the agent already has it, so it is read and delivered as it is saved,
    and its key keeps it from asking for a reply by command."""

    command = RecordTypedPrompt

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordTypedPrompt, context: Context) -> Message:
        return self.repository.save(Message(session_agent_id=context.actor.id, creator_id=context.actor.id, type=MessageType.USER, text=command.text,
                                            read_at=context.timestamp, delivered_at=context.timestamp, peer_key=PROMPT_MESSAGE_KEY), context)
