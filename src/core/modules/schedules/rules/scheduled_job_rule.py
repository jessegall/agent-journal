from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.schedules.effects.scheduled_job_effect import SCHEDULED_JOB_RULE, ScheduledJobEffect


class ScheduledJobRule(DriverRule):
    """The old walk's answer for ScheduledJobEffect, which owns it, until the walk is deleted."""

    name = SCHEDULED_JOB_RULE
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*ScheduledJobEffect.commands_of(hook.event, hook.agent_id))
