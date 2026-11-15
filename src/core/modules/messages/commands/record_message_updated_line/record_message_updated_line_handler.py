from dataclasses import replace

from engine.enums.line_delivery import LineDelivery
from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from core.modules.drivers.listeners.typed_line_listener import IDLE_MESSAGE_SOURCE
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from engine.driver.nudger import MessageSender
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.nudges.message_updated_notice import MessageUpdatedNotice
from core.modules.messages.models.message import Message
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from core.modules.messages.support.message_targets import MessageTargets

UPDATED_SOURCE = "messages.updated"
# the line an idle agent gets for an updated message, given to its program's wake hook when one waits


class RecordMessageUpdatedLineHandler(Handler[RecordMessageUpdatedLine, None]):
    """Leaves the line for the main agent: when it sits idle, given to its wake hook or else typed, otherwise carried
    by its next hook."""

    command = RecordMessageUpdatedLine

    def __init__(self, queries: Queries, nudger: MessageSender, hook_calls: HookCallQuery, targets: MessageTargets) -> None:
        self.queries, self.nudger, self.hook_calls = queries, nudger, hook_calls
        self.targets = targets

    def handle(self, command: RecordMessageUpdatedLine, context: Context) -> None:
        message = self.queries.query(Message).filter(id=command.message_id).first()
        if message is None or message.type not in PERSON_MESSAGE_TYPES or message.read_at is None:
            return
        agent = self.targets.recipient(message)
        if agent is None:
            return
        # an idle agent hears it through its program's wake hook, a working one at its next hook
        if self.hook_calls.has_ended_turn(agent.id):
            self.nudger.send(agent.id, replace(MessageUpdatedNotice.declared(), delivery=LineDelivery.WAKE_HOOK), IDLE_MESSAGE_SOURCE, context, message=command.message_id)
            return
        self.nudger.send(agent.id, MessageUpdatedNotice.declared(), UPDATED_SOURCE, context, message=command.message_id)
