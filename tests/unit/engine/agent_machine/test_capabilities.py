from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.capability import Capability
from engine.enums.capability_fallback import CapabilityFallback
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.hook_event_name import HookEventName

TABLE = Capabilities(
    Capability(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE, CapabilityProof.IMPLEMENTED_HERE, CapabilityFallback.PROCESS_RUN_REFUSAL),
    Capability(CapabilityPart.WAKE_HOOK, HookEventName.STOP, CapabilityProof.DOCUMENTED_UPSTREAM, CapabilityFallback.TYPING_OR_RESUME),
)


def test_a_part_written_here_is_carried() -> None:
    assert TABLE.supports(CapabilityPart.REWRITE, HookEventName.PRE_TOOL_USE)


def test_a_part_documented_upstream_waits_for_its_proof() -> None:
    assert not TABLE.supports(CapabilityPart.WAKE_HOOK, HookEventName.STOP)


def test_an_undeclared_part_is_not_carried() -> None:
    assert not TABLE.supports(CapabilityPart.REWRITE, HookEventName.STOP)
