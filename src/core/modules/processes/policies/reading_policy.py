from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer

READING_KEY = "processes.reading"


class ReadingPolicy(EventPolicy):
    """A command that ran without a good reader is refused its next start until a reader or a reason is given, for
    every role."""

    key = READING_KEY
    rank = "shell.all"

    def __init__(self, enforcer: ReadingEnforcer) -> None:
        self.enforcer = enforcer

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.enforcer.answer(event).refusal
