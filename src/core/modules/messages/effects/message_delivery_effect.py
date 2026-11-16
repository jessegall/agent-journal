from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from core.modules.messages.commands.record_message_delivery.record_message_delivery import RecordMessageDelivery
from core.modules.messages.lines.new_message_lines import DELIVERY_EVENTS, MESSAGE_DELIVERY_KEY
from core.modules.messages.support.undelivered_messages import UndeliveredMessages


class MessageDeliveryEffect(EventEffect):
    """Records the delivery of the messages the hook named to its target agent, in one write."""

    key = MESSAGE_DELIVERY_KEY
    events = DELIVERY_EVENTS

    def __init__(self, undelivered: UndeliveredMessages) -> None:
        self.undelivered = undelivered

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        batch = self.undelivered.batch(event, agent_id)
        return [RecordMessageDelivery(tuple(batch.messages))] if batch is not None and batch.messages else []
