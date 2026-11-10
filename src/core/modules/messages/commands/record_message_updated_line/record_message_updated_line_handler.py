from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.drivers.listeners.typed_line_listener import IDLE_MESSAGE_SOURCE
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.driver.nudger import Nudger
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.support.message_nudges import MESSAGE_UPDATED
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.support.message_targets import MessageTargets

UPDATED_SOURCE = "messages.updated"


class RecordMessageUpdatedLineHandler(Handler[RecordMessageUpdatedLine, None]):
    """Leaves the line for the main agent: typed when it sits idle, else carried by its next hook."""

    command = RecordMessageUpdatedLine

    def __init__(self, queries: Queries, nudger: Nudger, hook_calls: HookCallQuery, targets: MessageTargets) -> None:
        self.queries, self.nudger, self.hook_calls = queries, nudger, hook_calls
        self.targets = targets

    def handle(self, command: RecordMessageUpdatedLine, context: Context) -> None:
        message = self.queries.query(Message).filter(id=command.message_id).first()
        if message is None or message.type not in PERSON_MESSAGE_TYPES or message.read_at is None:
            return
        agent = self.targets.recipient(message)
        if agent is None:
            return
        source = IDLE_MESSAGE_SOURCE if self.hook_calls.is_idle(agent.id, context.timestamp) else UPDATED_SOURCE
        self.nudger.send(agent.id, MESSAGE_UPDATED, source, context, message=command.message_id)
