from dataclasses import dataclass, field

from engine.agent_stack.row_reference import RowReference
from engine.agent_stack.work_reference import WorkReference
from engine.enums.decision_class import DecisionClass

ALLOWED_KEY = "drivers.allowed"


@dataclass(frozen=True)
class Reason:
    """Why a constraint answered an action as it did: its key, the class it asks for, its rank key, its text,
    the commands that lift it, the subject it is about and whether it is a safety refusal; a stop that hands
    in names the work it hands in."""

    key: str
    decision_class: DecisionClass
    rank: str
    text: str
    lifting_lines: tuple[str, ...] = ()
    subject: RowReference | None = None
    job_report: WorkReference | None = field(default=None, compare=False)
    # a safety refusal has no skip, which the refusal skip command reads from the record
    is_safety: bool = False

    @classmethod
    def allowed(cls) -> "Reason":
        return cls(ALLOWED_KEY, DecisionClass.ALLOW, "", "")
