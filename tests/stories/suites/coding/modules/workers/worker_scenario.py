from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.chat.support.mark_samples import marks_text
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH
from tests.stories.suites.coding.modules.workers.test_queue import ended, recording_launch


def expect_states(story, **states) -> None:
    for task, state in states.items():
        story.expect_text(f"task show {task.removeprefix('task')}", f"state: {state}", actor=story.agent)


def proved(story, repository, worker, point_file: str, text: str) -> None:
    repository.changed(worker.id, point_file, text)
    story.expect_success(f'proof make 1 "{point_file}:1, its story" --test "pytest tests/{point_file}"', actor=worker)


def test_a_worker_takes_three_tasks_in_one_run_hands_them_in_once_and_is_merged_after_a_failed_test(new_story, monkeypatch):
    story = new_story(fixture=OrchestratorWithOpenTask)
    started = recording_launch(monkeypatch)
    repository = repository_environment(story)
    story.expect_success('task make "Add the tax" --brief "Add the tax" --environment main', actor=story.agent)
    story.expect_success('task make "Print the receipt" --brief "Print the receipt" --environment main', actor=story.agent)

    # the main agent gives one worker three tasks: the first starts, the others wait in its queue
    worker = Actor(story.new_row_id("worker dispatch --model sonnet 1 2 3", actor=story.agent), ActorType.AGENT)
    expect_states(story, task1="started", task2="open", task3="open")

    # the first task: delivering is refused while tasks are queued, and next moves on with no hand-in
    proved(story, repository, worker, "cart.py", "TOTAL = 2\n")
    story.expect_refusal("worker deliver", "task 2 is still in your queue", actor=worker)
    story.expect_text("worker next", "your next task, task 2: Add the tax", actor=worker)
    expect_states(story, task1="testing", task2="started", task3="open")

    # the second task
    proved(story, repository, worker, "tax.py", "TAX = 1\n")
    story.expect_text("worker next", "your next task, task 3: Print the receipt", actor=worker)
    expect_states(story, task1="testing", task2="testing", task3="started")
    story.run_listeners()
    assert "handed in" not in marks_text(story), marks_text(story)

    # the last task: there is no next, and the one delivery hands all three in and queues their tests
    proved(story, repository, worker, "receipt.py", "RECEIPT = 1\n")
    story.expect_refusal("worker next", "task 3 is your last", actor=worker)
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    expect_states(story, task1="testing", task2="testing", task3="testing")
    assert "handed in task 1, task 2, task 3" in marks_text(story), marks_text(story)
    assert "Tests of worker" in marks_text(story) and "queued" in marks_text(story), marks_text(story)

    # the journal runs the tests in turn; the one that fails goes back to the worker, with a mark in the chat
    ended(story, started[0], 0)
    ended(story, started[1], 1)
    ended(story, started[2], 0)
    assert "1 failed, back with the worker" in marks_text(story), marks_text(story)
    story.expect_text(f"agent-line list --agent {worker.id}", "your tests failed: pytest tests/tax.py")
    expect_states(story, task1="testing", task2="started", task3="testing")

    # the worker fixes it and delivers again, and only that test runs again
    repository.changed(worker.id, "tax.py", "TAX = 2\n")
    story.expect_success("worker deliver", actor=worker)
    story.run_listeners()
    assert len(started) == 4
    ended(story, started[3], 0)
    assert "passed" in marks_text(story), marks_text(story)

    # all pass: the main agent is told to merge, and the merge closes all three
    story.expect_text(f"agent-line list --agent {story.agent.id}", f"the tests of worker:{worker.id} all pass", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)
    expect_states(story, task1="completed", task2="completed", task3="completed")
    repository.expect_file(ENVIRONMENT_BRANCH, "tax.py", "TAX = 2\n")
