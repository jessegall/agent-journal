from tests.stories.suites.coding.modules.workers.support.commit_command import request_merge
from tests.stories.core.support.agent_labels import agent_number
import subprocess
from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.ticks.run_end_recovery import RunEndRecovery
from tests.stories.core.modules.chat.support.mark_samples import expect_absent_marks_text, expect_marks_text
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch
from suites.coding.modules.workers.support.worker_nudges import WORKER_TESTS_PASSED
from engine.testing.expectations.expected_nudge import expected_nudge


def expect_states(story, **states) -> None:
    for task, state in states.items():
        story.expect_text(f"task show {task.removeprefix('task')}", f"state: {state}", actor=story.agent)


def proved(story, repository, worker, point_file: str, text: str, task: int = 1) -> None:
    repository.changed(worker.id, point_file, text)
    story.expect_success(f'proof make 1 --task {task} "{point_file}:1, its story" --test "python tests/{point_file}"', actor=worker)


def test_a_worker_that_started_a_task_beside_the_one_whose_tests_run_stays_on_it_and_the_tested_task_closes(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print the receipt" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("task start 3", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    expect_states(story, task1="completed", task2="open", task3="started")
    story.expect_success('proof make 1 --task 3 "receipt.py:1, read by hand"', actor=worker)
    story.expect_text("proof list --task 3", "receipt.py:1", actor=worker)


def test_a_worker_whose_current_task_is_blocked_goes_on_to_its_next_open_task(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    story.expect_success('task block 1 --reason "waits on a user"', actor=story.agent)
    story.expect_success("worker next --wait", actor=worker)
    expect_states(story, task1="blocked", task2="started")
    story.expect_text("worker-worktree list --json", '"task_id": 2', actor=story.agent)


def test_a_worker_starts_a_task_that_depends_on_the_one_it_commits(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success("task depend 2 --on 1", actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("task start 2", actor=worker)
    story.expect_text(COMMIT, "its tests are queued", actor=worker)
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
    story.expect_success("worker commit --wait --differences none", actor=worker)
    story.run_listeners()
    ended(story, started[0], 0)
    expect_states(story, task1="completed")


def test_a_proof_test_whose_end_the_server_missed_still_completes_its_task(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("worker commit --wait --differences none", actor=worker)
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


def test_a_worker_commits_three_tasks_one_after_the_other_each_tested_and_is_merged(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print the receipt" --environment main', actor=story.agent)

    # the main agent gives one worker three tasks: the first starts, the others stay open until the worker starts them
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    expect_states(story, task1="started", task2="open", task3="open")

    # the first task: the worker starts the second beside it, and its commit queues the test of the first alone
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success("task start 2", actor=worker)
    story.expect_text(COMMIT, "its tests are queued", "go on with task 2", actor=worker)
    story.run_listeners()
    expect_states(story, task1="testing", task2="started", task3="open")
    expect_absent_marks_text(story, "handed in")
    story.expect_refusal(COMMIT, "nothing is staged", actor=worker)

    # its test fails: the first task goes back to the worker with a mark in the chat, beside the second
    ended(story, started[0], 1)
    expect_marks_text(story, "1 failed, back with the worker")
    story.expect_text(f"agent-line list --agent {worker.id}", f"Your tests failed, output {started[0]}")
    expect_states(story, task1="started", task2="started", task3="open")

    # the worker fixes it and shows the proof a second time: this commit's test passes and completes the first task
    proved(story, repository, worker, "cart.py", "TOTAL = 3\n")
    story.expect_text(COMMIT, "its tests are queued", actor=worker)
    story.run_listeners()
    ended(story, started[1], 0)
    expect_states(story, task1="completed", task2="started", task3="open")
    story.expect_text(f"agent-line list --agent {worker.id}", "Your commit's tests passed")

    # the second task, with the third started beside it
    proved(story, repository, worker, "tax.py", "TAX = 1\n", 2)
    story.expect_success("task start 3", actor=worker)
    story.expect_success(COMMIT, actor=worker)
    story.run_listeners()
    ended(story, started[2], 0)
    expect_states(story, task1="completed", task2="completed", task3="started")

    # the last task: its commit leaves no started task, so it hands the worktree in and runs its test
    proved(story, repository, worker, "receipt.py", "RECEIPT = 1\n", 3)
    story.expect_text(COMMIT, "Every task of your unit is committed", actor=worker)
    request_merge(story, worker)
    story.run_listeners()
    expect_states(story, task1="completed", task2="completed", task3="testing")
    expect_marks_text(story, "handed in")
    ended(story, started[3], 0)
    expect_marks_text(story, "passed")
    expect_states(story, task1="completed", task2="completed", task3="completed")

    # all pass: the main agent is told to merge, and the merge keeps all three completed
    story.expect_text(f"agent-line list --agent {story.agent.id}", expected_nudge(WORKER_TESTS_PASSED), actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker logs {agent_number(story, worker.id)}", actor=story.agent)
    request_merge(story, worker)
    story.expect_success(f"worker merge --wait {agent_number(story, worker.id)}", actor=story.agent)
    expect_states(story, task1="completed", task2="completed", task3="completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "cart.py", "TOTAL = 3\n")


def test_a_worker_with_queued_tasks_is_not_reported_while_its_own_tests_run(new_story, monkeypatch):
    story = new_story(fixture=OpenTaskOrchestrator)
    recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    worker = Actor(story.new_row_id("worker dispatch --test-command python=pytest --model sonnet 1 2", actor=story.agent), ActorType.AGENT)
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_success(COMMIT, actor=worker)
    story.expect_success(f"agent end {worker.id}", actor=worker)
    story.advance(timedelta(minutes=20))
    story.tick("s-1")
    story.expect_no_text(f"agent-line list --agent {story.agent.id}", f"worker:{agent_number(story, worker.id)} has stopped")
