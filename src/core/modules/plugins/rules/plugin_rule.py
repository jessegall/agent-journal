from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.plugins.support.plugin_hook_run import PLUGIN_RULE_NAME, PluginHookRun


class PluginRule(DriverRule):
    """The old walk's answer for PluginPolicy, PluginLines and PluginEffect, which own it, until the walk is deleted."""

    name = PLUGIN_RULE_NAME
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    role_group = RoleGroup.PLUGIN

    def __init__(self, run: PluginHookRun) -> None:
        self.run = run

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.run.answer(hook.event, hook.agent_id)
        if answer.refusal is not None:
            return RuleAnswer(refusal=answer.refusal.text, nudges=tuple([answer.refusal]), commands=answer.commands)
        return RuleAnswer.allowed().running(*answer.commands)
