from abc import abstractmethod
from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.line_source import LineSource
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel

# the events no program carries a line on: a line there waits for the agent's next line event
UNCARRIED_EVENTS = {HookEventName.TICK, HookEventName.MESSAGE_DISPLAY}


class EventLineSource(LineSource):
    """A line source that tells an agent lines from the event alone, or at its minute step when it keeps time;
    its lines are recorded under its key."""


    def __init_subclass__(cls, **kwargs: object) -> None:
        super().__init_subclass__(**kwargs)
        cls.includes_steps = HookEventName.TICK in cls.events
        if set(cls.events) <= UNCARRIED_EVENTS:
            cls.channel = LineChannel.WAITING

    def lines(self, question: Question, view: AgentView) -> Sequence[Line]:
        return [Line.of_agent_message(agent_message, self.channel) for agent_message in self.agent_messages(question.event, view.agent.agent_id)]

    # the lines this event tells the agent; no event is the agent's minute step
    @abstractmethod
    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]: ...
