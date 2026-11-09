import pytest

from datetime import timedelta

from core.modules.settings.bindings.support.setting_values import SettingValues
from core.base.duration_unit import DurationUnit
from suites.coding.modules.workers.support.worker_settings import WORKER_IDLE_HOURS
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, checked_worker, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.stuck import MAIN_SESSION, PROCESS_START
from tests.stories.suites.coding.modules.workers.test_queue import PROOF, ended, queued_story, recording_launch


def waiting_task(story, worker):
    task_id = story.new_row_id('task make "Continue after the worker" --environment main', actor=story.agent)
    story.expect_success(f"task block {task_id} --on worker:{worker.id}", "state: blocked", actor=story.agent)
    return task_id


def working_story(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    return story, repository, worker


def test_a_task_waits_while_the_worker_still_works(new_story):
    story, _, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    story.run_listeners()
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)


def test_finishing_one_task_in_a_workers_batch_keeps_the_wait_blocked(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    second_id = story.new_row_id('task make "Second job" --brief "Finish the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"worker dispatch --model sonnet 1 {second_id}")
    task_id = waiting_task(story, worker)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_success(f"task show {second_id}", "state: started", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)


def test_merging_a_worker_opens_the_task_waiting_on_it(new_story):
    story, repository, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success('proof make 1 --task 1 "cart.py:1, the cart story"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_releasing_a_worker_opens_the_task_waiting_on_it(new_story):
    story, _, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    story.expect_success(f'worker release {worker.id} "cancelled"', actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_ending_a_worker_opens_the_task_waiting_on_it(new_story):
    story, _, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_worker_waiting_for_tests_does_not_open_the_task_even_if_its_session_ends(new_story, monkeypatch):
    story, _, worker, processes = queued_story(new_story, monkeypatch)
    task_id = waiting_task(story, worker)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)
    ended(story, processes[0], 0)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_failed_test_keeps_the_task_waiting_for_the_workers_correction(new_story, monkeypatch):
    story, _, worker, processes = queued_story(new_story, monkeypatch)
    task_id = waiting_task(story, worker)
    ended(story, processes[0], 1)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)


def test_a_worker_ending_between_tests_and_its_next_task_keeps_the_wait_blocked(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    processes = recording_launch(monkeypatch)
    second_id = story.new_row_id('task make "Second job" --brief "Finish the second job" --environment main', actor=story.agent)
    worker = dispatched_worker(story, f"worker dispatch --model sonnet 1 {second_id}")
    task_id = waiting_task(story, worker)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(PROOF, actor=worker)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    story.clock.advance(timedelta(seconds=1))
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.clock.advance(timedelta(seconds=1))
    ended(story, processes[0], 0)
    story.expect_success(f"task show {second_id}", "state: started", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)


@pytest.fixture
def working(new_story):
    return working_story(new_story)



def test_a_task_cannot_wait_on_a_worker_that_has_already_ended(working):
    story, _, worker = working
    task_id = story.new_row_id('task make "Continue" --environment main', actor=story.agent)
    story.expect_success(f"agent end {worker.id}", actor=story.agent)
    story.expect_refusal(f"task block {task_id} --on worker:{worker.id}", "already finished", actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_task_cannot_wait_on_a_worker_that_was_released(working):
    story, _, worker = working
    task_id = story.new_row_id('task make "Continue" --environment main', actor=story.agent)
    story.expect_success(f'worker release {worker.id} "cancelled"', actor=story.agent)
    story.expect_refusal(f"task block {task_id} --on worker:{worker.id}", "already finished", actor=story.agent)


def test_a_task_cannot_wait_on_a_worker_that_was_merged(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = checked_worker(story, repository)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    task_id = story.new_row_id('task make "Continue" --environment main', actor=story.agent)
    story.expect_refusal(f"task block {task_id} --on worker:{worker.id}", "already finished", actor=story.agent)


def test_a_worker_target_must_exist_and_have_the_worker_role(new_story):
    story, _, worker = working_story(new_story)
    task_id = story.new_row_id('task make "Continue" --environment main', actor=story.agent)
    story.expect_refusal(f"task block {task_id} --on worker:99999", "worker 99999 does not exist", actor=story.agent)
    story.expect_refusal(f"task block {task_id} --on worker:{story.agent.id}", "is not a worker", actor=story.agent)


def test_a_crashed_worker_opens_the_task_at_the_next_process_check(new_story):
    story, _, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    story.expect_success(f"agent edit {worker.id} --pid 700 --process-started-at {PROCESS_START}", actor=story.agent)
    story.use_processes()
    story.tick(MAIN_SESSION)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_worker_that_never_started_is_retired_and_opens_the_task(new_story):
    story, _, worker = working_story(new_story)
    task_id = waiting_task(story, worker)
    hours = story.container.get(SettingValues).number(WORKER_IDLE_HOURS)
    story.clock.advance(timedelta(seconds=hours * DurationUnit.HOUR.seconds))
    story.tick(MAIN_SESSION)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_a_task_waits_for_both_the_worker_and_its_other_target(new_story):
    story, _, worker = working_story(new_story)
    task_id = story.new_row_id('task make "Continue" --environment main', actor=story.agent)
    dependency_id = story.new_row_id('task make "Other dependency" --environment main', actor=story.agent)
    story.expect_success(f"task block {task_id} --on worker:{worker.id} --on task:{dependency_id}", actor=story.agent)
    story.expect_success(f'worker release {worker.id} "cancelled"', actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: blocked", actor=story.agent)
    story.expect_success(f'task cancel {dependency_id} --reason "not needed"', actor=story.agent)
    story.expect_success(f"task show {task_id}", "state: open", actor=story.agent)


def test_the_command_help_and_task_skill_name_worker_waits(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.expect_text("task block --help", "worker:<n>", actor=story.agent)
    story.expect_text("skill show journal-workers", "--on worker:<m>", actor=story.agent)
