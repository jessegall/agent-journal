from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.processes.nudges.retry_loop_nudge import RetryLoopNudge


class RetryLoopPolicy(EventPolicy):
    """Refuses a shell line that runs something again until it works: the agent runs it once and reads the error."""

    key = "processes.retry-loop"
    rank = "shell.all"

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is not None and shell.is_retry_loop:
            return RetryLoopNudge.declared().nudge()
        return None
