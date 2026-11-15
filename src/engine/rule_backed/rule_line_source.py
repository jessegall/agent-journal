from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.container.container import Container
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory
from engine.enums.nudge_type import NudgeType
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks

# the events no program carries a line on: a rule's line there waits for the agent's next line event, as the walk saves it
UNCARRIED_EVENTS = {HookEventName.TICK, HookEventName.MESSAGE_DISPLAY}


class RuleLineSource(LineSource):
    """A line source of the new driver that gives the lines an old rule gives at its hook, with today's keys and
    texts. A module declares one subclass per rule; the lines slice of phase 8 moves each rule's body into its
    source before phase 10 deletes the rule."""

    rule: ClassVar[type[DriverRule]]

    def __init__(self, container: Container, hooks: RuleHooks) -> None:
        self.container, self.hooks = container, hooks

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.agent_types = RuleEvents.agent_types(cls.rule)
        cls.events = RuleEvents.hook_events(cls.rule)
        if set(cls.events) <= UNCARRIED_EVENTS:
            cls.carrier = LineCarrier.WAITING

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        hook = self.hooks.built(question, view)
        if hook is None:
            return []
        answer = self.container.get(self.rule).answer(hook)
        return [Line(nudge.key, nudge.text, LineCategory.STEERING if nudge.type is NudgeType.STEERING else LineCategory.INFORMATION, nudge.key, self.carrier)
                for nudge in answer.nudges]
