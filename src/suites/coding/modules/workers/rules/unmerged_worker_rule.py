from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.support.unmerged_workers import UNMERGED_WORKER_KEY, UnmergedWorkers


class UnmergedWorkerRule(DriverRule):
    """The old walk's answer for UnmergedWorkerLines and UnmergedWorkerEffect, which own it, until the walk is deleted."""

    name = UNMERGED_WORKER_KEY
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, unmerged: UnmergedWorkers) -> None:
        self.unmerged = unmerged

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.unmerged.answer(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*answer.nudges).running(*answer.stale)
