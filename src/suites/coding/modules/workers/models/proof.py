from dataclasses import dataclass

from engine.actor.actor import Actor
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.enums.proof_state import ProofState


@dataclass(frozen=True, kw_only=True)
class Proof(Model):
    """What a worker shows for one point of its task's brief, the test command the journal runs to check it, and
    what is missing when it is sent back short."""

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
    test_command: str = ""
    process_id: int | None = None

    def returned(self, worktree_id: int) -> "Proof":
        move = ProofLifecycle.return_short if self.state is ProofState.SHORT else ProofLifecycle.return_checked
        return self.moved(move, worktree_id=worktree_id)

    def ended_with_worktree(self, note: str) -> "Proof":
        return self.moved(ProofLifecycle.end_with_worktree, shortfall=note)

    def revise(self, timestamp: Timestamp, actor: Actor, text: str, test_command: str = "") -> "Proof":
        return self.moved(ProofLifecycle.revise, text=text, shortfall="", test_command=test_command or self.test_command, process_id=None)
