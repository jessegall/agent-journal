from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_wildcard import HookWildcard
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import RUN_QUEUE_HALTED, UPDATE_WAITING
from core.modules.processes.support.run_queue_halt import RunQueueHalt


class RunQueueHaltedRule(DriverRule):
    """While the process queue is halted, the main agent is reminded on hooks and clock ticks,
    and the nudge's interval keeps it to once in five minutes; so is an update that waits, naming the runs it
    waits for. A restart's own hold is not reminded of."""

    name = "processes.run-queue-halted"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, halt: RunQueueHalt) -> None:
        self.halt = halt

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.halt.command_halted:
            return RuleAnswer.with_nudges(RUN_QUEUE_HALTED.nudge())
        if self.halt.is_update_waiting:
            return RuleAnswer.with_nudges(UPDATE_WAITING.nudge(outputs=", ".join(f"output:{run}" for run in self.halt.running_run_ids()) or "none"))
        return RuleAnswer.allowed()
