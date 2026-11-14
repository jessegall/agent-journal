from engine.model.lifecycle import Lifecycle
from engine.model.move import Move
from suites.coding.modules.workers.models.enums.proof_state import ProofState


class ProofLifecycle(Lifecycle):
    """A proof is shown, then judged: committed and queued to run its test, checked or sent back short. A
    short or checked proof of a task that a failed checkpoint returned goes with the task to the worktree
    the task is worked in again, in the state it has."""

    states = ProofState
    initial = [ProofState.SHOWN]
    editable = [ProofState.SHOWN]
    deletable = ()

    commit = Move("commit", [ProofState.SHOWN], ProofState.COMMITTED)
    queue = Move("queue", [ProofState.SHOWN, ProofState.COMMITTED], ProofState.QUEUED)
    run = Move("run", [ProofState.QUEUED], ProofState.RUNNING)
    check = Move("check", [ProofState.SHOWN, ProofState.COMMITTED, ProofState.RUNNING], ProofState.CHECKED)
    short = Move("short", [ProofState.SHOWN, ProofState.COMMITTED, ProofState.RUNNING, ProofState.CHECKED], ProofState.SHORT)
    end_with_worktree = Move("end_with_worktree", [ProofState.QUEUED, ProofState.RUNNING], ProofState.SHORT)
    revise = Move("revise", [ProofState.SHORT], ProofState.SHOWN)
    return_short = Move("return_short", [ProofState.SHORT], ProofState.SHORT)
    return_checked = Move("return_checked", [ProofState.CHECKED], ProofState.CHECKED)
