from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle


@dataclass(frozen=True)
class ShortProof(MoveCommand[Proof]):
    move = ProofLifecycle.short
    shortfall: str
