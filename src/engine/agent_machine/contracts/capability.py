from dataclasses import dataclass

from engine.enums.answer_encoding import AnswerEncoding
from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.hook_event_name import HookEventName

USABLE_PROOFS = (CapabilityProof.IMPLEMENTED_HERE, CapabilityProof.PROVED_RUNNING)


@dataclass(frozen=True)
class Capability:
    """Whether a program supports one part of an answer on one event, how that is known, how it is encoded and
    what the step does instead where it cannot."""

    part: CapabilityPart
    event: HookEventName
    proof: CapabilityProof
    fallback: CapabilityFallback = CapabilityFallback.NONE
    encoding: AnswerEncoding = AnswerEncoding.JSON_DECISION

    def is_usable(self) -> bool:
        return self.proof in USABLE_PROOFS

    def used_fallback(self) -> CapabilityFallback:
        return CapabilityFallback.NONE if self.is_usable() else self.fallback
