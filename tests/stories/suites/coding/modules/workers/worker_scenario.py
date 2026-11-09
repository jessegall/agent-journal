import subprocess
from datetime import timedelta

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from tests.stories.core.modules.chat.support.mark_samples import marks_text, expect_absent_marks_text, expect_marks_text
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch


def expect_states(story, **states) -> None:
    for task, state in states.items():
        story.expect_text(f"task show {task.removeprefix('task')}", f"state: {state}", actor=story.agent)


def proved(story, repository, worker, point_file: str, text: str, task: int = 1) -> None:
    repository.changed(worker.id, point_file, text)
    story.expect_success(f'proof make 1 --task {task} "{point_file}:1, its story" --test "python tests/{point_file}"', actor=worker)


def test_a_worker_that_took_a_queued_task_while_its_tests_ran_stays_on_it_and_the_tested_task_closes(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print the receipt" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    story.expect_success("task start 3", actor=worker)
    ended(story, started[0], 0)
    expect_states(story, task1="completed", task2="open", task3="started")
    story.expect_success('proof make 1 --task 3 "receipt.py:1, read by hand"', actor=worker)
    story.expect_text("proof list --task 3", "receipt.py:1", actor=worker)


def test_a_worker_moves_on_to_a_queued_task_that_depends_on_the_one_it_hands_over(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_text("worker next --wait --differences none", "tests of task 1 are queued", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    expect_states(story, task1="completed", task2="started")


def test_a_proof_with_no_test_leaves_a_task_to_close_when_its_tests_pass(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success('proof make 1 --task 1 "read by hand, no test to run"', actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    expect_states(story, task1="completed")


def test_a_proof_test_whose_end_the_server_missed_still_completes_its_task(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    ended_program = subprocess.Popen(["true"])
    ended_program.wait()
    folder = story.container.get(OutputFolder)
    folder.write_pid(started[0], ended_program.pid)
    folder.write_end(started[0], 0)
    story.advance(timedelta(seconds=11))
    RunEndRecovery()(story.container)
    story.run_listeners()
    expect_states(story, task1="completed")


def test_a_worker_takes_three_tasks_one_tested_after_the_other_hands_them_in_once_and_is_merged(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print the receipt" --environment main', actor=story.agent)

    # the main agent gives one worker three tasks: the first starts, the others wait in its queue
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    expect_states(story, task1="started", task2="open", task3="open")

    # the first task: delivering is refused while tasks are queued; next commits it and queues its test
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_refusal("worker deliver --wait --differences none", "task 2 is still in your queue", actor=worker)
    story.expect_text("worker next --wait --differences none", "tests of task 1 are queued", actor=worker)
    story.run_listeners()
    expect_states(story, task1="testing", task2="open", task3="open")
    expect_absent_marks_text(story, "handed in")
    story.expect_refusal("worker next --wait --differences none", "the tests of task 1 are running", actor=worker)

    # its test fails: the task goes back to the worker with a mark in the chat, and the next task waits
    ended(story, started[0], 1)
    expect_marks_text(story, "1 failed, back with the worker")
    story.expect_text(f"agent-line list --agent {worker.id}", f"your tests failed, output {started[0]}")
    expect_states(story, task1="started", task2="open", task3="open")

    # the worker fixes it: next again, and this time its test passes, which starts the second task with its brief
    repository.changed(worker.id, "cart.py", "TOTAL = 3\n")
    story.expect_text("worker next --wait --differences none", "tests of task 1 are queued", actor=worker)
    story.run_listeners()
    ended(story, started[1], 0)
    expect_states(story, task1="completed", task2="started", task3="open")
    story.expect_text(f"agent-line list --agent {worker.id}", "Your next task is task:2")

    # the second task
    proved(story, repository, worker, "tax.py", "TAX = 1\n", 2)
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[2], 0)
    expect_states(story, task1="completed", task2="completed", task3="started")
    story.expect_text("chat-mark list --environment 1", "worker-tests:1:1", "worker-tests:1:2")

    # the last task: there is no next, and the one delivery hands all three in and runs its test
    proved(story, repository, worker, "receipt.py", "RECEIPT = 1\n", 3)
    story.expect_refusal("worker next --wait --differences none", "task 3 is your last", actor=worker)
    story.expect_success("worker deliver --wait --differences none", actor=worker)
    story.run_listeners()
    expect_states(story, task1="completed", task2="completed", task3="testing")
    expect_marks_text(story, "handed in task 1, task 2, task 3")
    ended(story, started[3], 0)
    expect_marks_text(story, "passed")
    expect_states(story, task1="completed", task2="completed", task3="completed")

    # all pass: the main agent is told to merge, and the merge closes all three
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the tests of worker:{worker.id} all pass", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    story.expect_success(f"worker merge --wait {worker.id}", actor=story.agent)
    expect_states(story, task1="completed", task2="completed", task3="completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_a_worker_with_queued_tasks_is_not_reported_while_its_own_tests_run(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("worker next --wait --differences none", actor=worker)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.advance(timedelta(minutes=20))
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{worker.id} has stopped")
