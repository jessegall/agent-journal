from abc import ABC, abstractmethod
from collections.abc import Sequence
from typing import ClassVar

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question
from engine.agent_machine.record.rewrite import Rewrite
from engine.enums.transform_slot import TransformSlot


class Transform(ABC):
    """Rewrites an admitted tool input in its one slot; the changed action is judged again and never
    transformed a second time."""

    slot: ClassVar[TransformSlot]

    @abstractmethod
    def applied(self, question: Question, view: AgentView) -> Rewrite: ...
