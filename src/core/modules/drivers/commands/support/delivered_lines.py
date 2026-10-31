from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answers import RuleAnswers
from core.modules.drivers.models.agent_line import AgentLine

TOOL_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE)
TOOL_HOOK_LINES = 3


@dataclass(frozen=True)
class DeliveredLines:
    """The waiting lines a hook gives the agent: none on a tick, which reaches no agent, or while the newest layer
    delays lines, three on a tool hook, all of them on any other; the rest stay waiting."""

    rows: Sequence[AgentLine]

    @classmethod
    def chosen(cls, event: HookEvent, answers: RuleAnswers, waiting: Sequence[AgentLine]) -> "DeliveredLines":
        if answers.delays_lines or event.event == HookEventName.TICK:
            return cls([])
        return cls(list(waiting)[:TOOL_HOOK_LINES] if event.event in TOOL_HOOKS else list(waiting))

    @property
    def texts(self) -> list[str]:
        return [row.text for row in self.rows]
