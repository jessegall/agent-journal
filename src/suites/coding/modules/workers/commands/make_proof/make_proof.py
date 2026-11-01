from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.proof import Proof


@dataclass(frozen=True)
class MakeProof(Command[Proof]):
    """Shows how a worker met one point of its task's brief, or shows it again after it was sent back short."""

    point: int
    text: str
