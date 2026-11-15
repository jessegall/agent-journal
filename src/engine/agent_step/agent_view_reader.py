from abc import ABC, abstractmethod

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.record.question import Question


class AgentViewReader(ABC):
    """Reads everything one step of an agent needs in one snapshot that begins with the answer basis, through
    injected queries; on a retry the caller reads it whole again."""

    @abstractmethod
    def read(self, agent_id: int, question: Question) -> AgentView: ...
