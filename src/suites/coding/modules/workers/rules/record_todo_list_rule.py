from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.effects.record_todo_list_effect import RecordTodoListEffect


class RecordTodoListRule(DriverRule):
    """The old walk's answer for RecordTodoListEffect, which owns it, until the walk is deleted."""

    name = RecordTodoListEffect.key
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.*"]

    def __init__(self, effect: RecordTodoListEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
