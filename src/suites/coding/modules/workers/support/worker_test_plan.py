from dataclasses import dataclass


@dataclass(frozen=True)
class ProofRun:
    """Queued proofs of one worktree that run as one program in the checkout made for them."""

    proof_ids: tuple[int, ...]
    folder: str
    command: str


@dataclass(frozen=True)
class PickerRun:
    """The first answer of a worktree whose picker runs in the checkout made for it."""

    affected_test_id: int
    folder: str


@dataclass(frozen=True)
class WorkerTestPlan:
    """The worker tests to start, decided and checked out before the write that starts them, since a checkout never
    runs while every other write waits: the proof runs, the picker runs and the first answers to cancel."""

    proof_runs: tuple[ProofRun, ...] = ()
    picker_runs: tuple[PickerRun, ...] = ()
    cancelled_ids: tuple[int, ...] = ()
