from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.effect import Effect
from engine.agent_machine.decision_record import DecisionRecord
from engine.command.command import Command
from engine.container.container import Container
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.enums.effect_timing import EffectTiming
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks


class RuleEffect(Effect):
    """An effect of the new driver that runs the commands an old rule hands back at its hook, whatever the
    decision; the blocks a rule opens are the needs' business, so they are left out. A module declares one
    subclass per rule."""

    rule: ClassVar[type[DriverRule]]
    timing = EffectTiming.UNCONDITIONAL

    def __init__(self, container: Container, hooks: RuleHooks) -> None:
        self.container, self.hooks = container, hooks

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.agent_types = RuleEvents.agent_types(cls.rule)
        cls.events = RuleEvents.hook_events(cls.rule)

    def commands(self, view: AgentView, record: DecisionRecord) -> Sequence[Command[object]]:
        hook = self.hooks.built(record.action, view)
        if hook is None:
            return []
        answer = self.container.get(self.rule).answer(hook)
        return [command for command in (*answer.commands, *answer.commands_unrefused) if not isinstance(command, BlockUntil)]
