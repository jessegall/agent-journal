from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.commands.record_waiting_message_line.record_waiting_message_line import RecordWaitingMessageLine


class WaitingMessageEffect(EventEffect):
    """Retries messages at the minute step when an agent can be woken."""

    key = "messages.waiting-message"
    events = [HookEventName.TICK]
    agent_types = [AgentRole.MAIN.value]

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        return [RecordWaitingMessageLine(agent_id)]
