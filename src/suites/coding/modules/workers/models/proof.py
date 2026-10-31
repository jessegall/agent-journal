from dataclasses import dataclass

from core.base.actor import Actor
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.enums.proof_state import ProofState


@dataclass(frozen=True, kw_only=True)
class Proof(Model):
    """What a worker shows for one point of its task's brief, and what is missing when it is sent back short."""

    model_name = "proof"
    cli_name = "proof"
    lifecycle = ProofLifecycle

    task_id: int
    worktree_id: int
    creator_id: int
    point: int
    text: str
    shortfall: str = ""
    state: ProofState = ProofState.SHOWN

    def revise(self, timestamp: Timestamp, actor: Actor, text: str) -> "Proof":
        return self.moved(ProofLifecycle.revise, text=text, shortfall="")
