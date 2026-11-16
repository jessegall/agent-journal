from collections.abc import Sequence

from engine.agent_machine.contracts.agent_listener import AgentListener
from engine.agent_machine.states.step_requests import StepRequests
from engine.event.created import Created
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_targets import MessageTargets


class MessageStepListener(AgentListener[Created[Message]]):
    """A message to an agent asks for the step of the agent that receives it, in the write that saved it, so a
    resting agent hears of it even when the server stops right after (doc 1310 section 6.2); a message that
    names no agent goes to the main agent."""

    name = "messages.message-step"

    def __init__(self, requests: StepRequests, targets: MessageTargets) -> None:
        super().__init__(requests)
        self.targets = targets

    def agents(self, event: Created[Message]) -> Sequence[int]:
        recipient = self.targets.recipient(event.row)
        return (recipient.id,) if recipient is not None else ()
