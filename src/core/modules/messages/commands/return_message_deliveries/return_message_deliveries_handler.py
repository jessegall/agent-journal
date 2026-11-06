from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.hook_call import HookCall
from core.modules.messages.commands.return_message_deliveries.return_message_deliveries import ReturnMessageDeliveries
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery


class ReturnMessageDeliveriesHandler(Handler[ReturnMessageDeliveries, tuple[Message, ...]]):
    """Clears the delivery a hook call gave each message, which carries the hook call's own time, so the next hook
    tells the agent again."""

    command = ReturnMessageDeliveries

    def __init__(self, queries: Queries, messages: MessageQuery, repository: Repository) -> None:
        self.queries, self.messages, self.repository = queries, messages, repository

    def handle(self, command: ReturnMessageDeliveries, context: Context) -> tuple[Message, ...]:
        call = self.queries.query(HookCall).find(command.hook_call_id)
        told = tuple(self.messages.told_at(call.session_agent_id, call.creation_timestamp()).all_rows())
        return tuple(self.repository.update(message, context, delivered_at=None) for message in told)
