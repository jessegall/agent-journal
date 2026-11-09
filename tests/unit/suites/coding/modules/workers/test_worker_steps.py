import pytest

from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_step_facts import WorkerStepFacts
from suites.coding.modules.workers.support.worker_step_text import step_line

FACTS = WorkerStepFacts(task_id=7, open_task_count=2, test_runs_available=1, label="phase 3", deliver_command="journal worker next", conflict_files="cart.py")


def test_only_wait_and_asked_may_stop():
    assert {step for step in WorkerStep if step.may_stop()} == {WorkerStep.WAIT, WorkerStep.QUESTION}


@pytest.mark.parametrize("step", list(WorkerStep))
def test_every_step_gives_what_now_then(step):
    line = step_line(step, FACTS)
    assert line.index("Now:") < line.index("Then:")
    assert line.split("Now:")[0].strip()
    assert line.split("Now:")[1].split("Then:")[0].strip()
    assert line.split("Then:")[1].strip()


def test_group_end_names_the_hand_in_command_of_its_facts():
    assert "journal worker deliver" in step_line(WorkerStep.GROUP_END, FACTS.changed_deliver_command("journal worker deliver"))
    assert "journal worker next" in step_line(WorkerStep.GROUP_END, FACTS)


def test_clash_names_its_files():
    assert "cart.py" in step_line(WorkerStep.CONFLICT, FACTS)


def test_wait_names_its_label_and_stops():
    line = step_line(WorkerStep.WAIT, FACTS)
    assert "phase 3" in line and "Now: stop" in line


@pytest.mark.parametrize("step", list(WorkerStep))
def test_no_step_says_say_you_are_stuck(step):
    assert "say you are stuck" not in step_line(step, FACTS)


def test_step_values_are_stable():
    assert [step.value for step in WorkerStep] == ["build", "task-proven", "group-end", "wait", "fix", "conflict", "question"]
