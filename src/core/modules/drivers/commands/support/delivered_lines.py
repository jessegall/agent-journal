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
    """The waiting lines a hook gives the agent: none on a tick or a hook whose program cannot carry lines, which
    reach no agent, or while the newest layer delays lines, three on a tool hook, all of them on any other; the
    rest stay waiting. A text the rules already say, or an earlier line says, is told once."""

    rows: Sequence[AgentLine]
    told: Sequence[str] = ()

    @classmethod
    def chosen(cls, event: HookEvent, answers: RuleAnswers, waiting: Sequence[AgentLine]) -> "DeliveredLines":
        if answers.delays_lines or event.event == HookEventName.TICK or not event.accepts_lines:
            return cls([])
        return cls(list(waiting)[:TOOL_HOOK_LINES] if event.event in TOOL_HOOKS else list(waiting), answers.lines)

    @property
    def texts(self) -> list[str]:
        return [text for text in dict.fromkeys(row.text for row in self.rows) if text not in self.told]
