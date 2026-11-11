from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.missing_points import MissingPoints
from suites.coding.modules.workers.support.staging import Staging
from suites.coding.modules.workers.support.worker_staging import WorkerStaging

WORKER_ID = 7
WORKTREE = Worktree(id=3, session_agent_id=WORKER_ID, task_id=12, creator_id=1, folder="/work", branch="workers/cart", base_branch="main", base_commit="abc")
CART = Task(id=12, creator_id=1, title="Fix the cart", brief="- the total adds the tax\n- the total rounds to cents")
TAX = Task(id=15, creator_id=1, title="Add the tax", brief="- the tax is read\n- the tax is added\n- the tax is shown\n- the tax is rounded")
TOTALS = Task(id=16, creator_id=1, title="Show the totals")


def proof(task: Task, point: int, state: ProofState = ProofState.SHOWN) -> Proof:
    return Proof(task_id=task.id, worktree_id=WORKTREE.id, creator_id=WORKER_ID, point=point, text="cart.py:1", state=state)


class WorktreeProofs:
    def __init__(self, rows: tuple[Proof, ...]) -> None:
        self.rows = rows
        self.worktree_ids: list[int] = []

    def worktree_proofs(self, worktree_id: int) -> "WorktreeProofs":
        self.worktree_ids.append(worktree_id)
        return self

    def all_rows(self) -> tuple[Proof, ...]:
        return self.rows


class StartedTasks:
    def __init__(self, rows: tuple[Task, ...]) -> None:
        self.rows = rows
        self.agent_ids: list[int] = []

    def started_tasks(self, agent_id: int) -> tuple[Task, ...]:
        self.agent_ids.append(agent_id)
        return self.rows


def test_a_task_with_a_shown_proof_of_every_point_is_ready_and_the_commit_is_final():
    staging = Staging.grouped(tuple([CART]), (proof(CART, 1), proof(CART, 2)))
    assert staging == Staging(tuple([CART]), (), ())
    assert staging.is_final()


def test_a_checked_proof_proves_its_point_beside_a_shown_one_and_a_short_proof_proves_none():
    assert Staging.grouped(tuple([CART]), (proof(CART, 1, ProofState.CHECKED), proof(CART, 2))).ready == tuple([CART])
    assert Staging.grouped(tuple([CART]), (proof(CART, 1, ProofState.SHORT), proof(CART, 2))).incomplete == tuple([MissingPoints(CART, tuple([1]))])


def test_a_task_with_a_shown_proof_that_misses_points_is_incomplete_and_its_text_lists_every_missing_point():
    staging = Staging.grouped((CART, TAX), (proof(CART, 1), proof(TAX, 1), proof(TAX, 3)))
    assert staging.incomplete == (MissingPoints(CART, tuple([2])), MissingPoints(TAX, (2, 4)))
    assert staging.missing_text() == "task 12: point 2 has no proof; task 15: points 2, 4 have no proof"
    assert not staging.is_final()


def test_a_started_task_with_no_shown_proof_is_unproved_and_the_commit_is_not_final():
    staging = Staging.grouped((CART, TOTALS), (proof(CART, 1), proof(CART, 2), proof(TOTALS, 1, ProofState.CHECKED)))
    assert staging == Staging(tuple([CART]), (), tuple([TOTALS]))
    assert not staging.is_final()


def test_the_staging_of_a_worktree_reads_the_started_tasks_of_its_worker_and_the_proofs_of_the_worktree():
    proofs, tasks = WorktreeProofs((proof(CART, 1), proof(CART, 2))), StartedTasks((CART, TOTALS))
    staging = WorkerStaging(proofs, tasks).read(WORKTREE)
    assert staging == Staging(tuple([CART]), (), tuple([TOTALS]))
    assert (proofs.worktree_ids, tasks.agent_ids) == ([WORKTREE.id], [WORKER_ID])
