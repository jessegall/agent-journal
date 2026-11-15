from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.lines.agent_text_lines import AGENT_TEXT_KEY
from core.modules.messages.support.agent_text_answer import AgentTextAnswer


class AgentTextEffect(EventEffect):
    """Sends a finished text block of the main agent to the chat as its message."""

    key = AGENT_TEXT_KEY
    events = [HookEventName.MESSAGE_DISPLAY]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, answer: AgentTextAnswer) -> None:
        self.answer = answer

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        message = self.answer.shown(event, agent_id).message if event is not None else None
        return [message] if message is not None else []
