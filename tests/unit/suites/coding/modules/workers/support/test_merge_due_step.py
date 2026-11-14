from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_step_facts import WorkerStepFacts
from suites.coding.modules.workers.support.worker_step_text import step_line


def test_merge_due_and_fix_may_not_stop():
    assert (WorkerStep.MERGE_DUE.may_stop(), WorkerStep.FIX.may_stop(), WorkerStep.WAIT.may_stop()) == (False, False, True)


def test_the_merge_due_line():
    facts = WorkerStepFacts(task_id=7, open_task_count=0, test_runs_available=None, label="your work", unit_name="plan 1118", unit_task_count=78)
    assert step_line(WorkerStep.MERGE_DUE, facts).startswith("Your unit is done: plan 1118, 78 tasks committed, the tests of every checkpoint passed on your commits. "
                                                            'Now: journal worker ask-merge "<what the merge holds>".')
