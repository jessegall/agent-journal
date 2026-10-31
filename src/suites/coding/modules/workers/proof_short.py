from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.proof_lifecycle import ProofLifecycle


@dataclass(frozen=True)
class ProofShort(MoveCommand[Proof]):
    move = ProofLifecycle.short
    shortfall: str
