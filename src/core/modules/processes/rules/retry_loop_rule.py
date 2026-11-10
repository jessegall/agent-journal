from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.process_nudges import RETRY_LOOP


class RetryLoopRule(DriverRule):
    """Refuses a shell line that runs something again until it works: the agent runs it once and reads the error."""

    name = "processes.retry-loop"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    refuses_one_action = "Refuses a shell line that runs something again until it works"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is not None and shell.is_retry_loop:
            return RuleAnswer.refused(RETRY_LOOP.nudge())
        return RuleAnswer.allowed()
