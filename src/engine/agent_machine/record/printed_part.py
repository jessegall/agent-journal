from dataclasses import dataclass

from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof


@dataclass(frozen=True)
class PrintedPart:
    """How one part of a decision reached the program: the capability it used, how that is known, and any fallback taken."""

    part: CapabilityPart
    proof: CapabilityProof
    fallback: CapabilityFallback = CapabilityFallback.NONE
