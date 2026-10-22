from dataclasses import dataclass
from typing import ClassVar

from journal.models.proof_state import ProofState
from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Proof(Scoped):
    """What a worker shows for one point of its task's brief, linked to the task; who settled it is its updater."""

    text_fields: ClassVar[tuple[str, ...]] = ("text",)

    point: int = 0
    text: str = ""
    state: ProofState = ProofState.SHOWN
