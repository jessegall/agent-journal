from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.lines.orphan_process_lines import ORPHAN_PROCESS_KEY
from core.modules.processes.support.orphan_check import OrphanCheck


class OrphanProcessRule(DriverRule):
    """The old walk's answer for OrphanProcessLines and OrphanProcessEffect, which own it, until the walk is deleted."""

    name = ORPHAN_PROCESS_KEY
    hook = HookEventName.TICK
    drivers = ["*"]

    def __init__(self, check: OrphanCheck) -> None:
        self.check = check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        orphaned = self.check.orphaned(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*orphaned.nudges).running(*orphaned.commands)
