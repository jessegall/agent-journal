from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.attribution import Attribution
from suites.coding.modules.workers.support.failure_attribution import FailureAttribution

LAST_TASK_ID = 3


def proof(task_id: int, test_command: str) -> Proof:
    return Proof(task_id=task_id, worktree_id=1, creator_id=1, point=1, text="shown", test_command=test_command)


ATTRIBUTION = FailureAttribution((proof(1, "pytest tests/cart.py"), proof(2, "pytest tests/cart.py tests/tax.py"), proof(3, "pytest tests/totals.py")), LAST_TASK_ID)


def test_a_failing_path_one_task_names_in_its_proof_goes_to_that_task():
    assert ATTRIBUTION.attributed(tuple(["tests/tax.py"])) == Attribution(2, True)
    assert ATTRIBUTION.attributed(("tests/tax.py", "tests/receipts.py")) == Attribution(2, True)


def test_a_failure_that_names_no_path_of_a_proof_goes_to_the_task_completed_last_and_names_no_task():
    assert ATTRIBUTION.attributed(tuple(["tests/receipts.py"])) == Attribution(LAST_TASK_ID, False)
    assert ATTRIBUTION.attributed(()) == Attribution(LAST_TASK_ID, False)


def test_a_failing_path_the_proofs_of_several_tasks_name_goes_to_the_task_completed_last_and_names_no_task():
    assert ATTRIBUTION.attributed(tuple(["tests/cart.py"])) == Attribution(LAST_TASK_ID, False)
