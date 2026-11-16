from collections.abc import Sequence
from dataclasses import replace

from engine.agent_machine.contracts.capability import Capability
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.hook_event_name import HookEventName


class Capabilities:
    """A program's table of capabilities, declared beside its printer; the engine reads it and never compares
    program names."""

    def __init__(self, *capabilities: Capability) -> None:
        self.capabilities = capabilities

    def capability(self, part: CapabilityPart, event: HookEventName) -> Capability | None:
        return next((capability for capability in self.capabilities if (capability.part, capability.event) == (part, event)), None)

    # the table as the proofs recorded for this program say, each "program:part:event=proved-live" or
    # "=refused-live" with the report that proves it after a space; a proof of another program changes nothing
    def proved(self, program: str, proofs: Sequence[str]) -> "Capabilities":
        match = {}
        for entry in proofs:
            target, _, outcome = entry.partition(" ")[0].partition("=")
            name, _, part_event = target.partition(":")
            part, _, event = part_event.partition(":")
            if name == program and outcome in (CapabilityProof.PROVED_RUNNING, CapabilityProof.REFUSED_RUNNING):
                match[(part, event)] = CapabilityProof(outcome)
        return Capabilities(*(replace(capability, proof=match.get((capability.part.value, capability.event.value), capability.proof)) for capability in self.capabilities))

    def supports(self, part: CapabilityPart, event: HookEventName) -> bool:
        capability = self.capability(part, event)
        return capability is not None and capability.is_usable()
