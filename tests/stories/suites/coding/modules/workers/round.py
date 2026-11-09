import pytest

from core.base.driver.command_category import CommandCategory
from core.testing.shell_part import ShellPart
from suites.coding.modules.workers.support.worker_nudges import PHASE_TEST_RUN_ALLOWED
from tests.stories.suites.coding.modules.workers.support.judge_plugin import SINFUL_TEXT, judge_plugin_folder, PLUGIN_NAME
from tests.stories.suites.coding.modules.workers.support.phase_steps import PLAN_DISPATCH, start_planned_worker
from tests.stories.support.story_checks import expect_value, expect_value_with


FILE_TEST_COMMAND = "python tests/cart.py"
HAND_IN = "worker next --wait --differences none"


def worker_test_hook(worker, *words):
    return worker.run_line("journal worker test " + " ".join(words), ShellPart("journal", CommandCategory.JOURNAL, ["worker", "test", *words]))


@pytest.fixture
def group_worker(new_story, monkeypatch):
    return start_planned_worker(new_story, monkeypatch, PLAN_DISPATCH)


@pytest.fixture
def handed_in_group(group_worker):
    for _ in range(3):
        group_worker.prove_advance(FILE_TEST_COMMAND)
    return group_worker


@pytest.fixture
def failed_group(handed_in_group):
    handed_in_group.end_tests(1, 0, 0)
    return handed_in_group


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


def test_the_status_line_and_the_line_the_worker_hears_say_the_same_when_a_test_failed(failed_group):
    expect_value_with(failed_group.worker_lines()[-1], failed_group.status_line())


def test_a_run_inside_a_phase_carries_the_warning(group_worker):
    reply = worker_test_hook(group_worker, "python", "tests/cart.py")
    expect_value_with(reply.lines, PHASE_TEST_RUN_ALLOWED.nudge(remaining=2).text)


def test_a_run_after_the_hand_in_uses_no_run_of_the_group(handed_in_group):
    before = handed_in_group.status_json()["test_runs_available"]
    expect_value(worker_test_hook(handed_in_group, "python", "tests/cart.py").refusal, "")
    expect_value(handed_in_group.status_json()["test_runs_available"], before)


def test_the_end_of_the_group_tells_the_worker_its_tests_are_queued(handed_in_group):
    expect_value_with(handed_in_group.status_line(), "queued")


def test_a_hand_in_inside_a_group_is_not_judged(judged_first_hand_in):
    worker, outcome = judged_first_hand_in
    expect_value(outcome.code, 0)
    expect_value(judged_file(worker.story).exists(), False)


def test_the_end_of_the_group_judges_all_its_tasks_together(judged_last_of_group):
    outcome = judged_last_of_group
    expect_value(outcome.code != 0 and "[plugin judge] own.py has a sin" in outcome.output_text, True)
