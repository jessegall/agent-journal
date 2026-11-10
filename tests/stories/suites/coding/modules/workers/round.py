import pytest

from engine.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder, PLUGIN_NAME
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with


FILE_TEST_COMMAND = "python tests/cart.py"
HAND_IN = "worker next --wait --differences none"


def worker_test_hook(worker, *test_arguments):
    return worker.run_line("journal worker test " + " ".join(test_arguments), ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *test_arguments]))


@pytest.fixture
def group_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PLAN_DISPATCH)


def judged_file(story):
    return story.home.folder / f"plugin-data/{PLUGIN_NAME}/worker_delivering.json"


@pytest.fixture
def judged_group_worker(group_worker):
    story = group_worker.story
    story.expect_success(f"plugin install {judge_plugin_folder(story.home.folder.parent)} --yes", actor=story.user)
    group_worker.repository.changed(group_worker.worker.id, "own.py", SINFUL_TEXT)
    return group_worker


@pytest.fixture
def judged_first_hand_in(judged_group_worker):
    return judged_group_worker, judged_group_worker.prove_advance()


@pytest.fixture
def judged_last_of_group(judged_group_worker):
    judged_group_worker.prove_advance()
    judged_group_worker.prove_advance()
    return judged_group_worker.prove_advance()


def test_a_group_of_three_tasks_with_a_failure_and_a_free_run(group_worker):
    group_worker.prove_advance(FILE_TEST_COMMAND)
    status = group_worker.status_json()
    expect_value((status["step"], status["test_runs_available"], group_worker.started), ("build", 3, []))
    group_worker.prove_advance(FILE_TEST_COMMAND)
    group_worker.prove_advance(FILE_TEST_COMMAND)
    expect_value(group_worker.status_json()["step"], "wait")
    expect_value(len(group_worker.started), 3)
    group_worker.end_tests(1, 0, 0)
    expect_value(group_worker.status_json()["step"], "fix")
    expect_value(worker_test_hook(group_worker, "python", "tests/cart.py").refusal, "")
    group_worker.story.expect_success(HAND_IN, actor=group_worker.worker)
    expect_value(len(group_worker.started), 4)
    group_worker.end_test(group_worker.started[3])
    expect_value((group_worker.status_json()["step"], group_worker.current_task()), ("build", 4))
    expect_value(any("ended with tasks left" in line for line in group_worker.worker_lines()), False)


def test_a_hand_in_inside_a_group_is_not_judged(judged_first_hand_in):
    worker, outcome = judged_first_hand_in
    expect_value(outcome.code, 0)
    expect_value(judged_file(worker.story).exists(), False)


def test_the_end_of_the_group_judges_all_its_tasks_together(judged_last_of_group):
    outcome = judged_last_of_group
    expect_value(outcome.code != 0 and "[plugin judge] own.py has a sin" in outcome.output_text, True)
