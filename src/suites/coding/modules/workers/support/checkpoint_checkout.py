from dataclasses import dataclass

from core.modules.plans.support.checkpoint_preparation import CheckpointPreparation
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest


@dataclass(frozen=True)
class CheckpointCheckout(CheckpointPreparation):
    """The run of a reach as decided and made before the write that starts it: whether its tests were started
    already, the committed proofs it queues, the tests it starts with their commands and the checkout they run in,
    or the worker whose checkout could not be made."""

    is_started: bool = False
    proof_ids: tuple[int, ...] = ()
    tests: tuple[CheckpointTest, ...] = ()
    folder: str = ""
    unstarted_worker_id: int | None = None

    @property
    def has_work(self) -> bool:
        return bool(self.proof_ids or self.tests)
