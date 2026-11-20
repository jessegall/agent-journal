from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer

READ_POLICY_KEY = "processes.reading"


class ReadingPolicy(EventPolicy):
    """A command of the main agent that ran without a good reader is refused its next start until a reader or a
    reason is given."""

    key = READ_POLICY_KEY
    rank = "shell.all"

    def __init__(self, enforcer: ReadingEnforcer) -> None:
        self.enforcer = enforcer

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.enforcer.answer(event, agent_id).refusal
