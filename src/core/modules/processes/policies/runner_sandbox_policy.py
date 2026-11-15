from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.runner_plan import RUNNER_REWRITE_KEY, RunnerPlan


class RunnerSandboxPolicy(EventPolicy):
    """A read-only or separate-folder helper that runs in the sandbox is refused a shell line the runner cannot take
    safely: one that cannot be parsed, one with no runner installed, or one with no write folder."""

    key = RUNNER_REWRITE_KEY
    rank = "shell.all"

    def __init__(self, plan: RunnerPlan) -> None:
        self.plan = plan

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.plan.of_event(event, agent_id).refusal
