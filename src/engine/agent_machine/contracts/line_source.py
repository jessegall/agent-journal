from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_carrier import LineCarrier
from engine.enums.line_category import LineCategory


class LineSource(ABC):
    """Gives the lines an agent reads on the events it names, and at a step outside a hook when it says so;
    whatever the decision."""

    events: ClassVar[Sequence[HookEventName]]
    includes_steps: ClassVar[bool] = False
    agent_types: ClassVar[Sequence[str]] = ()
    # the group of agent types it holds for, read from the helper types as the old walk read a rule's
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    # the old driver rules this contribution answers for, which stand down once its slice is in force for the agent
    replaced_rules: ClassVar[Sequence[str]] = ()
    carrier: ClassVar[LineCarrier] = LineCarrier.NOW
    category: ClassVar[LineCategory] = LineCategory.INFORMATION
    interval_key: ClassVar[str] = ""

    @abstractmethod
    def lines(self, question: Question, view: AgentView) -> Sequence[Line]: ...
