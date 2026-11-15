from engine.agent_machine.contracts.capability import Capability
from engine.enums.capability_part import CapabilityPart
from engine.enums.hook_event_name import HookEventName


class Capabilities:
    """A program's table of capabilities, declared beside its printer; the engine reads it and never compares
    program names."""

    def __init__(self, *capabilities: Capability) -> None:
        self.capabilities = capabilities

    def capability(self, part: CapabilityPart, event: HookEventName) -> Capability | None:
        return next((capability for capability in self.capabilities if (capability.part, capability.event) == (part, event)), None)

    def supports(self, part: CapabilityPart, event: HookEventName) -> bool:
        capability = self.capability(part, event)
        return capability is not None and capability.is_usable()
