from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.hook_call import HookCall
from core.modules.messages.commands.reset_message_deliveries.reset_message_deliveries import ResetMessageDeliveries
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery


class ResetMessageDeliveriesHandler(Handler[ResetMessageDeliveries, tuple[Message, ...]]):
    """Clears the delivery a hook call gave each message, which carries the hook call's own time, so the next hook
    tells the agent again."""

    command = ResetMessageDeliveries

    def __init__(self, queries: Queries, messages: MessageQuery, repository: Repository) -> None:
        self.queries, self.messages, self.repository = queries, messages, repository

    def handle(self, command: ResetMessageDeliveries, context: Context) -> tuple[Message, ...]:
        call = self.queries.query(HookCall).find(command.hook_call_id)
        messages = tuple(self.messages.delivered(call.session_agent_id, call.creation_timestamp()).all_rows())
        return tuple(self.repository.update(message, context, delivered_at=None) for message in messages)
