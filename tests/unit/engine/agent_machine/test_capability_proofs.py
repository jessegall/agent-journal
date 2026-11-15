from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.capability import Capability
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.hook_event_name import HookEventName

WAKE = Capability(CapabilityPart.WAKE_HOOK, HookEventName.STOP, CapabilityProof.DOCUMENTED_UPSTREAM)


def test_a_live_proof_of_the_program_makes_its_capability_usable_and_another_programs_changes_nothing():
    proofs = [f"codex:{CapabilityPart.WAKE_HOOK.value}:{HookEventName.STOP.value}={CapabilityProof.PROVED_LIVE.value} report 1"]
    assert Capabilities(WAKE).proved("codex", proofs).supports(CapabilityPart.WAKE_HOOK, HookEventName.STOP)
    assert not Capabilities(WAKE).proved("claude", proofs).supports(CapabilityPart.WAKE_HOOK, HookEventName.STOP)
