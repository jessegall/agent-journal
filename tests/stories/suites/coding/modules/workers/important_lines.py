from core.base.actor import Actor
from core.base.command.bus import Bus
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import CART_CHANGE, FIRST_PROOF, dispatched_worker, repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

LEFT_OUT = "Left out the phone width, no test exists for it"
OWN_LINE = "python3 -m pytest tests/stories/cart.py -q"


def proved_worker(story):
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    repository.changed(worker.id, "cart.py", CART_CHANGE)
    story.expect_success(FIRST_PROOF, "point: 1", actor=worker)
    return repository, worker


def test_a_hand_in_must_say_what_differs_from_the_task(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    _, worker = proved_worker(story)
    story.expect_refusal("worker deliver", "what did you do differently", actor=worker)
    story.expect_refusal("worker next", "what did you do differently", actor=worker)


def test_a_difference_is_an_important_line_the_merge_asks_an_answer_to(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = proved_worker(story)
    story.expect_success(f'worker deliver --differences "{LEFT_OUT}"', actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_text(f"worker logs {worker.id}", f"! {LEFT_OUT}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_refusal(f"worker merge {worker.id}", "important log lines you have not answered", actor=story.agent)
    story.expect_success(f'worker merge {worker.id} --read-important "The phone width follows in its own task"', actor=story.agent)
    story.expect_text("task overview 1", "main agent on the important lines: The phone width follows in its own task")


def test_no_difference_writes_no_line_and_the_merge_asks_nothing(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository, worker = proved_worker(story)
    story.expect_success("worker deliver --differences none", actor=worker)
    story.expect_success("proof check 1", actor=story.agent)
    story.expect_success(f"worker logs {worker.id}", actor=story.agent)
    repository.checkout(ENVIRONMENT_BRANCH)
    story.expect_success(f"worker merge {worker.id}", actor=story.agent)


def test_the_logs_give_a_notes_first_words_and_a_task_shows_them_whole(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    _, worker = proved_worker(story)
    story.expect_success('task log 1 "one two three four five six seven eight nine ten"', actor=worker)
    story.expect_success('task log 1 --important "I could not work out the rounding"', actor=worker)
    story.expect_success("worker deliver --differences none", actor=worker)
    summary = story.run(f"worker logs {worker.id}", actor=story.agent).output_text
    story.expect_rows("! I could not work out the rounding" in summary, "one two three four five six seven eight" in summary, "nine ten" not in summary)
    story.expect_text(f"worker logs {worker.id} --task 1", "one two three four five six seven eight nine ten", actor=story.agent)


def test_a_test_failing_five_times_in_a_workers_own_runs_is_kept_from_the_worker_and_shown_to_the_main_agent(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    _, worker = proved_worker(story)
    bus = story.container.get(Bus)
    for _ in range(5):
        bus.run(RecordOwnTestFailure(worker.id, 1, OWN_LINE), Actor.core(), environment_id=1)
    assert "failed 5 times" not in story.run("task overview 1", actor=worker).output_text
    story.expect_success("worker deliver --differences none", actor=worker)
    story.expect_text(f"worker logs {worker.id}", "! its own runs failed 5 times: tests/stories/cart.py", actor=story.agent)


def test_a_failed_run_is_counted_for_each_test_file_it_names():
    story_line = "vitest run tests/windowData.test.js tests/chat_test.go --reporter=dot"
    assert WorkerTestFailures.test_names(story_line) == ("tests/windowData.test.js", "tests/chat_test.go")
    assert WorkerTestFailures.test_names("journal viewer-tests") == ("the whole run",)
