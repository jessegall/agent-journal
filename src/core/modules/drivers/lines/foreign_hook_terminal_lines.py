from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.support.foreign_hook_answers import MANAGED_HOOKS_KEY, ForeignHookAnswers

TERMINAL_KEY = "drivers.managed-hooks.terminal"


class ForeignHookTerminalLines(EventLineSource):
    """What the project's own hooks print to the person's terminal, passed on as they printed it."""

    key = MANAGED_HOOKS_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]
    carrier = LineCarrier.TERMINAL

    def __init__(self, answers: ForeignHookAnswers) -> None:
        self.answers = answers

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        terminal = self.answers.answer(event, agent_id).terminal if event is not None else ""
        return [Nudge(TERMINAL_KEY, NudgeType.NOTICE, terminal)] if terminal else []
