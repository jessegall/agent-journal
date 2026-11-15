from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel
from engine.enums.agent_message_type import AgentMessageType
from core.modules.drivers.support.foreign_hook_answers import MANAGED_HOOKS_KEY, ForeignHookAnswers

TERMINAL_KEY = "drivers.managed-hooks.terminal"


class ForeignHookTerminalLines(EventLineSource):
    """What the project's own hooks print to the person's terminal, passed on as they printed it."""

    key = MANAGED_HOOKS_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]
    carrier = LineChannel.TERMINAL

    def __init__(self, answers: ForeignHookAnswers) -> None:
        self.answers = answers

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        terminal = self.answers.answer(event, agent_id).terminal if event is not None else ""
        return [AgentMessage(TERMINAL_KEY, AgentMessageType.NOTICE, terminal)] if terminal else []
