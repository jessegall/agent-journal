from types import SimpleNamespace

from engine.agent_machine.needs.agent_reference import AgentReference
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.policies.proved_delivery_policy import ProvedDeliveryPolicy

WORKER = AgentReference(5, 4, 1, "worker")
WORKTREE = SimpleNamespace(id=3)


def policy(*states: ProofState) -> ProvedDeliveryPolicy:
    proofs = [SimpleNamespace(point=index + 1, state=state) for index, state in enumerate(states)]
    queries = SimpleNamespace(query=lambda model: SimpleNamespace(filter=lambda **fields: SimpleNamespace(newest=lambda: SimpleNamespace(first=lambda: WORKTREE))))
    return ProvedDeliveryPolicy(queries, SimpleNamespace(worktree_rows=lambda worktree_id: proofs))


def test_a_delivery_with_a_short_proof_is_refused_at_the_entrance_naming_the_point():
    reasons = policy(ProofState.CHECKED, ProofState.SHORT).entrance_refusals(AskMerge(5, "the unit"), WORKER)
    assert [reason.key for reason in reasons] == ["workers.proved-delivery"] and "point 2" in reasons[0].text


def test_a_delivery_whose_proofs_all_stand_passes():
    assert policy(ProofState.CHECKED, ProofState.COMMITTED).entrance_refusals(AskMerge(5, "the unit"), WORKER) == []
