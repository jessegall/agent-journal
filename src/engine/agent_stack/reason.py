from dataclasses import dataclass, field

from engine.agent_stack.subject_reference import SubjectReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass

ALLOWED_KEY = "drivers.allowed"


@dataclass(frozen=True)
class Reason:
    """Why a constraint answered an action as it did: its key, the class it asks for, its rank key, its text,
    the commands that lift it and the subject it is about; a stop that hands in names the work it hands in."""

    key: str
    decision_class: DecisionClass
    rank: str
    text: str
    lifting_lines: tuple[str, ...] = ()
    subject: SubjectReference | None = None
    hand_in: WorkReference | None = field(default=None, compare=False)

    @classmethod
    def allowed(cls) -> "Reason":
        return cls(ALLOWED_KEY, DecisionClass.ALLOW, "", "")
