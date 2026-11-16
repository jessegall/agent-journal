from engine.agent_machine.capabilities import Capabilities
from engine.agent_machine.contracts.capability import Capability
from engine.enums.capability_part import CapabilityPart
from engine.enums.capability_proof import CapabilityProof
from engine.enums.hook_event_name import HookEventName

COMPACTION_END_CAPABILITY = Capability(CapabilityPart.COMPACTION_END, HookEventName.COMPACT, CapabilityProof.DOCUMENTED_UPSTREAM)


def test_a_live_proof_of_the_program_makes_its_capability_usable_and_another_programs_changes_nothing():
    proofs = [f"codex:{CapabilityPart.COMPACTION_END.value}:{HookEventName.COMPACT.value}={CapabilityProof.PROVED_LIVE.value} report 1"]
    assert Capabilities(COMPACTION_END_CAPABILITY).proved("codex", proofs).supports(CapabilityPart.COMPACTION_END, HookEventName.COMPACT)
    assert not Capabilities(COMPACTION_END_CAPABILITY).proved("claude", proofs).supports(CapabilityPart.COMPACTION_END, HookEventName.COMPACT)
