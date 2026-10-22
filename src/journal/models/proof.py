from dataclasses import dataclass
from typing import ClassVar

from journal.events.rows.proof_short import ProofShort
from journal.models.proof_state import ProofState
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Proof(Scoped):
    """What a worker shows for one point of its task's brief, linked to the task; who settled it is its updater."""

    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    point: int = 0
    text: str = ""
    state: ProofState = ProofState.SHOWN
    shortfall: str = ""

    def checked(self) -> "Proof":
        return self.with_(state=ProofState.CHECKED)

    def short(self, shortfall: str, time: float, task_id: int, worker_id: int) -> "Proof":
        return self.with_(state=ProofState.SHORT, shortfall=shortfall).with_event(ProofShort(environment_id=self.environment_id, time=time, task_id=task_id, worker_id=worker_id, point=self.point, shortfall=shortfall))
