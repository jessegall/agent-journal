from engine.agent.enums.role_group import RoleGroup
from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.line import Line
from engine.agent_machine.record.question import Question
from engine.enums.hook_event_name import HookEventName
from engine.enums.line_channel import LineChannel
from engine.enums.line_category import LineCategory


class LineSource(ABC):
    """Gives the lines an agent reads on the events it names, and at a step outside a hook when it says so;
    whatever the decision."""

    events: ClassVar[Sequence[HookEventName]]
    includes_steps: ClassVar[bool] = False
    agent_types: ClassVar[Sequence[str]] = ()
    # the key its lines are recorded under, so their intervals and turns are kept per source
    key: ClassVar[str] = ""
    # the group of agent types it holds for, read from the helper types
    role_group: ClassVar[RoleGroup] = RoleGroup.ANY
    # a line of a session's start, which a resumed session does not get
    start_line: ClassVar[bool] = False
    channel: ClassVar[LineChannel] = LineChannel.IMMEDIATE
    category: ClassVar[LineCategory] = LineCategory.INFORMATION
    interval_key: ClassVar[str] = ""
    reads_line_history: ClassVar[bool] = False

    @abstractmethod
    def lines(self, question: Question, view: AgentView) -> Sequence[Line]: ...
