from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class StalledWorkerTests:
    """Every minute, tests no run holds are moved along: a proof of a task in testing whose test nothing queued, as
    after a proof edit, is queued, and a queued test a server update left behind is started."""

    def __call__(self, container: Container) -> None:
        bus = container.get(Bus)
        bus.run(QueueStalledTests(), Actor.core())
        environments = {worktree.id: worktree.environment_id for worktree in container.get(WorktreeQuery).all_worktrees()}
        queued = {environments[proof.worktree_id] for proof in container.get(ProofQuery).test_rows() if proof.state is ProofState.QUEUED and proof.worktree_id in environments}
        for environment_id in queued:
            bus.run(StartWorkerTests(), Actor.core(), environment_id=environment_id)
