from types import SimpleNamespace

from suites.coding.modules.workers.support.proof_test_command import ProofTestCommand
from suites.coding.modules.workers.support.worker_test_planner import WorkerTestPlanner

HOST = "go -C tools/journal-agent test -count=1 ./host/"


def proof(proof_id: int, command: str) -> SimpleNamespace:
    return SimpleNamespace(id=proof_id, worktree_id=57, test_command=command)


def test_the_proofs_of_one_go_package_share_one_run_and_identical_ones_join_it():
    proofs = [proof(1, f"{HOST} -run 'Owner|Limit'"), proof(2, f"{HOST} -run 'ApiKey|Refused'"), proof(3, f"{HOST} -run 'Owner|Limit'"),
              proof(4, "go -C tools/journal-agent test -count=1 ./drivers/ -run Contained")]
    groups = WorkerTestPlanner.run_groups(proofs)
    assert [[member.id for member in group] for group in groups] == [[1, 2, 3], [4]]


def test_a_shared_go_run_joins_every_filter_once():
    command = ProofTestCommand.combined([f"{HOST} -run 'Owner|Limit'", f"{HOST} -run 'ApiKey|Refused'", f"{HOST} -run 'Owner|Limit'"])
    assert command == f"{HOST} -run 'Owner|Limit|ApiKey|Refused'"
