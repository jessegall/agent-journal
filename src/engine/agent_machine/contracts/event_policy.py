from engine.enums.agent_message_type import AgentMessageType
from abc import abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.agent_stack.reason import Reason
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.decision_class import DecisionClass
from engine.enums.grant_type import GrantType
from engine.enums.hook_event_name import HookEventName


class EventPolicy(Policy):
    """A policy that judges the event alone, refusing with one line under its key; a refusal skip of that key
    passes it once, unless it is a safety policy."""

    events: ClassVar[Sequence[HookEventName]] = tuple([HookEventName.PRE_TOOL_USE])
    grant_types = [GrantType.REFUSAL_SKIP]

    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        event = question.event
        if event is None or event.event not in self.events:
            return []
        agent_message = self.refusal(event, view.agent.agent_id)
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, agent_message.text, is_safety=agent_message.type is AgentMessageType.SAFETY_REFUSAL)] if agent_message is not None else []

    # the line that refuses this event, or nothing
    @abstractmethod
    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None: ...
