from collections.abc import Sequence
from dataclasses import dataclass

from engine.driver.hook_event import HookEvent
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answers import RuleAnswers
from engine.driver.nudge import Nudge
from core.modules.drivers.models.agent_line import AgentLine

TOOL_HOOKS = (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE)
TOOL_HOOK_LINES = 3


@dataclass(frozen=True)
class DeliveredLines:
    """The waiting lines a hook gives the agent: none on a tick or a hook whose program cannot carry lines,
    which reach no agent, or while the newest layer delays lines, three on a tool hook, all of them on any
    other; the rest stay waiting. A text the rules already give, or an earlier line gives, is delivered
    once."""

    rows: Sequence[AgentLine]
    excluded: Sequence[str] = ()

    @classmethod
    def chosen(cls, event: HookEvent, answers: RuleAnswers, waiting: Sequence[AgentLine]) -> "DeliveredLines":
        if answers.delays_lines or event.event == HookEventName.TICK or not event.accepts_lines:
            return cls([])
        pending = {row.id: row.nudge for row in waiting}
        groups = Nudge.collapsed(pending.values())
        selected = groups[:TOOL_HOOK_LINES] if event.event in TOOL_HOOKS else groups
        keys = {(nudge.key, nudge.merge_context) for nudge in selected}
        return cls([row for row in waiting if (pending[row.id].key, pending[row.id].merge_context) in keys], answers.lines)

    @property
    def texts(self) -> list[str]:
        return [text for text in dict.fromkeys(nudge.text for nudge in Nudge.collapsed(row.nudge for row in self.rows)) if text not in self.excluded]

    def with_answers(self, answers: RuleAnswers) -> list[Nudge]:
        nudges = Nudge.collapsed([*answers.delivered_nudges, *(row.nudge for row in self.rows)])
        return list({nudge.text: nudge for nudge in nudges}.values())
