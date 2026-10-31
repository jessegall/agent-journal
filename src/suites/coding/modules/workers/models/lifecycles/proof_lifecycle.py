from core.base.model.lifecycle import Lifecycle
from core.base.model.move import Move
from suites.coding.modules.workers.models.enums.proof_state import ProofState


class ProofLifecycle(Lifecycle):
    states = ProofState
    initial = [ProofState.SHOWN]
    editable = [ProofState.SHOWN]
    deletable = ()

    check = Move("check", [ProofState.SHOWN], ProofState.CHECKED)
    short = Move("short", [ProofState.SHOWN], ProofState.SHORT)
    revise = Move("revise", [ProofState.SHORT], ProofState.SHOWN)
