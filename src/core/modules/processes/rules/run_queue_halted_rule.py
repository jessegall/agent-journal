from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import RUN_QUEUE_HALTED
from core.modules.processes.support.run_queue_halt import RunQueueHalt


class RunQueueHaltedRule(DriverRule):
    """While a command has halted the test queue, the main agent is reminded on any hook, the clock's tick included,
    and the nudge's interval keeps it to once in five minutes. A restart's own hold is not reminded of."""

    name = "processes.run-queue-halted"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, halt: RunQueueHalt) -> None:
        self.halt = halt

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.with_nudges(RUN_QUEUE_HALTED.nudge()) if self.halt.is_halted_by_command else RuleAnswer.allowed()
