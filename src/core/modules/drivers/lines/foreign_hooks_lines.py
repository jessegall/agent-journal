from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.support.foreign_hook_answers import MANAGED_HOOKS_KEY, ForeignHookAnswers


class ForeignHooksLines(EventLineSource):
    """The lines of the project's own hooks that are new since each last spoke to the agent, and the line of one that
    refused."""

    key = MANAGED_HOOKS_KEY
    events = [event for event in HookEventName if event is not HookEventName.TICK]

    def __init__(self, answers: ForeignHookAnswers) -> None:
        self.answers = answers

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        if event is None:
            return []
        answer = self.answers.answer(event, agent_id)
        return [*answer.nudges, *([answer.refusal] if answer.refusal is not None else [])]
