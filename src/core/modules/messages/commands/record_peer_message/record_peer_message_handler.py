from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.messages.commands.record_peer_message.record_peer_message import RecordPeerMessage
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message


class RecordPeerMessageHandler(Handler[RecordPeerMessage, Message]):
    """Saves a message from another agent session; the agent already has it, so it is read and delivered as it is
    saved."""

    command = RecordPeerMessage

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordPeerMessage, context: Context) -> Message:
        return self.repository.save(Message(session_agent_id=command.agent_id, creator_id=context.actor.id, type=MessageType.PEER, text=command.text,
                                            read_at=context.timestamp, delivered_at=context.timestamp, peer="" if command.outgoing else command.sender, recipient=command.sender if command.outgoing else "", peer_key=command.key), context)
