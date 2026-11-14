from engine.enums.command_category import CommandCategory
from engine.testing.examples.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.commit_command import COMMIT
from tests.stories.suites.coding.modules.workers.support.held_tasks import worker_with_tasks, prove_task, unplanned_worker_with_tasks
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder
from tests.stories.support.story_checks import expect_value


FILE_TEST_COMMAND = "python tests/cart.py"
THREE_TASKS = 3
TASK_IDS = (1, 2, 3)


def worker_test_hook(worker, *test_arguments):
    return worker.run_line("journal worker test " + " ".join(test_arguments), ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *test_arguments]))


def test_three_tasks_committed_together_with_a_failure_and_a_free_run(new_story, monkeypatch):
    worker = unplanned_worker_with_tasks(new_story, monkeypatch, THREE_TASKS)
    prove_task(worker, 1, 1, FILE_TEST_COMMAND)
    status = worker.status_json()
    expect_value((status["step"], status["test_runs_available"], worker.started), ("commit", 3, []))
    prove_task(worker, 2, 1, FILE_TEST_COMMAND)
    prove_task(worker, 3, 1, FILE_TEST_COMMAND)
    worker.story.expect_success(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    expect_value(worker.status_json()["step"], "wait")
    expect_value(len(worker.started), 3)
    worker.end_tests(1, 0, 0)
    expect_value(worker.status_json()["step"], "fix")
    expect_value(worker_test_hook(worker, "python", "tests/cart.py").refusal, "")
    prove_task(worker, 1, 1, FILE_TEST_COMMAND)
    worker.story.expect_success(COMMIT, actor=worker.worker)
    worker.story.run_listeners()
    expect_value(len(worker.started), 4)
    worker.end_test(worker.started[3])
    worker.story.expect_text("task show 1", "state: completed", actor=worker.story.agent)
    expect_value(any("ended with tasks left" in line for line in worker.worker_lines()), False)


def test_a_commit_of_three_tasks_judges_them_together(new_story, monkeypatch):
    worker = worker_with_tasks(new_story, monkeypatch, THREE_TASKS)
    worker.story.expect_success(f"plugin install {judge_plugin_folder(worker.story.home.folder.parent)} --yes", actor=worker.story.user)
    worker.repository.changed(worker.worker.id, "own.py", SINFUL_TEXT)
    for task_id in TASK_IDS:
        prove_task(worker, task_id, 1)
    outcome = worker.story.run(COMMIT, actor=worker.worker)
    expect_value(outcome.code != 0 and "[plugin judge] own.py has a sin" in outcome.output_text, True)
