from collections import defaultdict

from engine.listener.rows.event_rows import EventRows
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.models.checkpoint_test import CheckpointTest
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.failed_run import FailedRun
from suites.coding.modules.workers.support.failed_test_paths import FailedTestPaths
from suites.coding.modules.workers.support.failure_attribution import FailureAttribution


class CheckpointFailures:
    """Reads what failed in the run of a reach from its proofs and tests: a short proof belongs to its own
    task, and a failed own test or selected run to the task its output names, or to the task of the window
    that was completed last when it names none."""

    def __init__(self, output: OutputFolder, rows: EventRows) -> None:
        self.output, self.rows = output, rows

    def read(self, reach: CheckpointReach, proofs: tuple[Proof, ...], tests: tuple[CheckpointTest, ...]) -> FailedRun:
        task_outputs = defaultdict[int, list[int]](list)
        for proof in proofs:
            if proof.state is ProofState.SHORT and proof.process_id is not None:
                task_outputs[proof.task_id].append(proof.process_id)
        failed_tests = [test for test in tests if test.state is AffectedTestState.FAILED]
        fallback_task_id = None
        if failed_tests:
            attribution = FailureAttribution(tuple(proof for proof in proofs if proof.test_command), self.last_task_id(reach))
            for test in failed_tests:
                attributed = attribution.attributed(FailedTestPaths.read(self.output.all_output(test.process_id)).paths)
                task_outputs[attributed.task_id].append(test.process_id)
                fallback_task_id = fallback_task_id if attributed.is_certain else attributed.task_id
        return FailedRun({task_id: tuple(output_ids) for task_id, output_ids in task_outputs.items()}, fallback_task_id)

    def last_task_id(self, reach: CheckpointReach) -> int:
        window_order = list(reach.tasks())
        tasks = self.rows.required_index(Task, window_order).values()
        return max(tasks, key=lambda task: ("" if task.closed_at is None else task.closed_at.text, window_order.index(task.id))).id
