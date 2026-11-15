from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.enums.hook_event_name import HookEventName


class LineSource(ABC):
    """Gives the lines an agent reads on the events it names, and at a step outside a hook when it says so; whatever the decision."""

    events: ClassVar[Sequence[HookEventName]]
    at_step: ClassVar[bool] = False

    @abstractmethod
    def lines(self, question: Question, view: AgentView) -> Sequence[Line]: ...
