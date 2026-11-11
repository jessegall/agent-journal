from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.proof_state import ProofState


class ProofLifecycle(Lifecycle):
    states = ProofState
    initial = [ProofState.SHOWN]
    editable = [ProofState.SHOWN]
    deletable = ()

    commit = Move("commit", [ProofState.SHOWN], ProofState.COMMITTED)
    queue = Move("queue", [ProofState.SHOWN, ProofState.COMMITTED], ProofState.QUEUED)
    run = Move("run", [ProofState.QUEUED], ProofState.RUNNING)
    check = Move("check", [ProofState.SHOWN, ProofState.COMMITTED, ProofState.RUNNING], ProofState.CHECKED)
    short = Move("short", [ProofState.SHOWN, ProofState.COMMITTED, ProofState.RUNNING, ProofState.CHECKED], ProofState.SHORT)
    revise = Move("revise", [ProofState.SHORT], ProofState.SHOWN)
