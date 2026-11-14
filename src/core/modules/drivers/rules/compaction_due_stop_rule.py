from core.modules.drivers.support.compaction_stop import CompactionStop
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope


class CompactionDueStopRule(DriverRule):
    """While an agent's compaction is due, its stop goes through and no other stop rule is asked: the one place
    that decides it, so no stop rule ever asks for work an agent past its limit cannot run."""

    name = "drivers.compaction-due-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    essential = True
    priority = RulePriority.FIRST
    disabled_scopes = [ActorScope]

    def __init__(self, compaction: CompactionStop) -> None:
        self.compaction = compaction

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return self.compaction.answer(hook)
