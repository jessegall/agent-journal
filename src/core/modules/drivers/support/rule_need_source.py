from collections.abc import Mapping, Sequence
from typing import ClassVar

from engine.agent_stack.states.blocked import Blocked
from engine.agent_machine.needs.agent_reference import AgentReference
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.agent_machine.needs.need import Need
from engine.agent_machine.needs.need_source import NeedSource
from engine.agent_machine.record.question import Question
from engine.container.container import Container
from engine.driver.block_until import BlockUntil
from engine.driver.driver_rule import DriverRule
from engine.enums.closer_role import CloserRole
from engine.enums.hook_event_name import HookEventName
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan
from engine.rule_backed.rule_events import RuleEvents
from engine.rule_backed.rule_hooks import RuleHooks


class RuleNeedSource(NeedSource):
    """A need source of the new driver that plans the blocks an old rule opens at its hook, each as a plan with today's
    nudge, condition, tool grace and scopes; for a hold whose selection is involved, so it is read once, by the rule. A
    module declares one subclass per rule with its rank key; phase 6 moves each body into its need source before phase
    10 deletes the rule."""

    rule: ClassVar[type[DriverRule]]
    state_type = Blocked

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.agent_types = RuleEvents.agent_types(cls.rule)

    def __init__(self, container: Container, hooks: RuleHooks) -> None:
        self.container, self.hooks = container, hooks

    def needs(self, agents: Sequence[AgentReference], question: Question) -> Mapping[int, Sequence[Need | BlockPlan]]:
        if question.event is None or question.event.event not in RuleEvents.hook_events(self.rule) or question.event.event is HookEventName.TICK:
            return {}
        plans = {agent.agent_id: self.plans(agent.agent_id, question) for agent in agents}
        return {agent_id: list(found) for agent_id, found in plans.items() if found}

    def plans(self, agent_id: int, question: Question) -> list[BlockPlan]:
        hook = self.hooks.agent_hook(question, agent_id)
        if hook is None:
            return []
        answer = self.container.get(self.rule).answer(hook)
        return [self.plan(command) for command in (*answer.commands, *answer.commands_unrefused) if isinstance(command, BlockUntil)]

    def plan(self, block: BlockUntil) -> BlockPlan:
        spans = block.after.spans if block.after is not None else ()
        uses = next((span.count for span in spans if isinstance(span, ToolUseSpan)), 0)
        closers = tuple([CloserRole.AGENT]) if block.is_skippable else ()
        return BlockPlan(block.nudge, block.condition, self.rule.name, self.rank, tool_grace_uses=uses, scope_tools=not block.blocks_stop,
                         scope_stop=block.blocks_stop, is_strict=block.strict, closer_roles=closers)
