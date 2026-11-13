import pytest

from tests.stories.suites.coding.modules.workers.checkpoint_failures import end_run, failure_lines, produce_output
from tests.stories.suites.coding.modules.workers.checkpoint_runs import commit_tasks, merge, run_lines, sole_branch_runs
from tests.stories.suites.coding.modules.workers.support.phase_steps import PHASE_DISPATCH, SECOND_TEST_LINE, TEST_LINE, StoryWorker, dispatched_story_worker, planned_story

PHASE_TEST = "pytest tests/phase"
LISTING_LINE = f"{PHASE_TEST} --collect-only -q"
PHASE_FILES = ("tests/phase/test_a.py", "tests/phase/test_b.py", "tests/phase/test_c.py")
FILE_TEST_COUNT = 20
TEST_LIMIT = 25


@pytest.fixture
def listed_phase_test(new_story, monkeypatch) -> StoryWorker:
    """A checkpoint whose own test is a pytest run of 60 tests in three files: its listing ran and passed, so its parts run."""
    sole_branch_runs(monkeypatch)
    worker = dispatched_story_worker(planned_story(new_story, build_test=PHASE_TEST), PHASE_DISPATCH, monkeypatch)
    commit_tasks(worker, TEST_LINE, "", SECOND_TEST_LINE)
    merge(worker)
    produce_output(worker, LISTING_LINE, "".join(f"{file}::test_{number}\n" for file in PHASE_FILES for number in range(FILE_TEST_COUNT)))
    worker.end_test([process.id for process in worker.started_processes() if process.line == LISTING_LINE][-1], 0)
    return worker


def part_lines(worker: StoryWorker) -> list[str]:
    return [line for line in run_lines(worker) if line.startswith("pytest") and any(file in line for file in PHASE_FILES)]


def test_a_phase_test_of_sixty_tests_runs_as_three_parts_of_at_most_twenty_five(listed_phase_test):
    lines = part_lines(listed_phase_test)
    listed_phase_test.story.expect_rows(LISTING_LINE in run_lines(listed_phase_test), len(lines) == 3, all(sum(file in line for file in PHASE_FILES) * FILE_TEST_COUNT <= TEST_LIMIT for line in lines),
                                        detail=str(run_lines(listed_phase_test)))


def test_a_failure_in_the_second_part_fails_the_checkpoint_naming_its_files(listed_phase_test):
    end_run(listed_phase_test, part_lines(listed_phase_test)[1])
    lines = failure_lines(listed_phase_test)
    listed_phase_test.story.expect_rows(bool(lines) and PHASE_FILES[1] in " ".join(lines), detail=str(lines))
