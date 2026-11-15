from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.schedules.effects.scheduled_job_run_effect import SCHEDULED_JOB_RUN_RULE, ScheduledJobRunEffect


class ScheduledJobRunRule(DriverRule):
    """The old walk's answer for ScheduledJobRunEffect, which owns it, until the walk is deleted."""

    name = SCHEDULED_JOB_RUN_RULE
    hook = HookEventName.PROMPT
    drivers = ["*"]

    def __init__(self, effect: ScheduledJobRunEffect) -> None:
        self.effect = effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.allowed().running(*self.effect.commands_of(hook.event, hook.agent_id))
