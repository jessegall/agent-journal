from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.drivers.support.foreign_hook_answers import MANAGED_HOOKS_KEY, ForeignHookAnswers


class ForeignHooksRule(DriverRule):
    """The old walk's answer for ForeignHooksPolicy, ForeignHooksLines and ForeignHooksEffect, which own it, and the
    input it replaces, printed until task 10351 moves the rewrite into the machine."""

    name = MANAGED_HOOKS_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    essential = True

    def __init__(self, answers: ForeignHookAnswers) -> None:
        self.answers = answers

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.answers.answer(hook.event, hook.agent_id)
        nudges = (*answer.nudges, *([answer.refusal] if answer.refusal is not None else []))
        return RuleAnswer(refusal=answer.refusal.text if answer.refusal is not None else "", nudges=nudges, commands=answer.commands, updated_input=answer.updated_input,
                          source_name=answer.source_name, refusal_priority=-1, dropped_lines=answer.dropped_lines, terminal=answer.terminal)
