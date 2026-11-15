from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_wildcard import HookWildcard
from core.modules.processes.support.run_docking import LONG_RUN_DOCK_KEY, RunDocking


class LongRunDockRule(DriverRule):
    """The old walk's answer for LongRunDockEffect and LongRunDockNeeds, which own it, until the walk is deleted."""

    name = LONG_RUN_DOCK_KEY
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, docking: RunDocking) -> None:
        self.docking = docking

    def answer(self, hook: AgentHook) -> RuleAnswer:
        docked = self.docking.docked(hook.event, hook.agent_id)
        return RuleAnswer.with_nudges(*docked.nudges).running(*docked.commands)
