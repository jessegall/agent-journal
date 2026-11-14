import pytest

from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.models.reader import Reader
from core.modules.processes.queries.reader_request_query import ReaderRequestQuery
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, reader_worker, worker_run

PYTEST_SAMPLE = "================ test session starts ================\ncollected 2 items\n\ntests/cart.py .. [100%]\n\n================ 2 passed in 0.04s ================\n"


@pytest.fixture
def draft_sample(new_story):
    story = new_story(fixture=ForcedReaders)
    install_runner(story)
    process = worker_run(story, "custom-test run", CommandCategory.TEST_RUN)
    end_run(story, process, PYTEST_SAMPLE)
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    return story, request


def test_a_draft_from_a_pytest_output_finds_each_field_and_saves(draft_sample):
    story, request = draft_sample
    outcome = story.run(f"reader draft {request.id}", actor=story.agent)
    reader_command = next(line for line in outcome.output_text.splitlines() if line.startswith("journal reader add "))
    story.expect_text(reader_command.removeprefix("journal "), "name: pytest", actor=story.agent)
    story.expect_text(f"reader draft {request.id} --save", "saved reader pytest", actor=story.agent)
    reader = story.container.get(Queries).query(Reader).filter(name="pytest").page(1, 1).rows[0]
    story.expect_rows("custom-test run" in reader.commands, "pytest*" in reader.commands)


def test_a_draft_offers_an_existing_reader_that_already_passes(draft_sample):
    story, request = draft_sample
    story.run('reader add project-tests --commands "legacy-test*,custom-test*" --title "Project tests" --lines "passed" --summary "([0-9]+) passed" --count "collected ([0-9]+)" --progress "\\[([0-9]+)%\\]"', actor=story.agent)
    story.expect_text(f"reader draft {request.id}", "journal reader add project-tests", "legacy-test*,custom-test*,custom-test run", actor=story.agent)


def test_a_draft_says_which_field_it_could_not_fill_and_save_is_refused(draft_sample):
    story, request = draft_sample
    story.container.get(OutputFolder).write_output(request.sample_process_id, 1, "building cart\ncompiling\nwaiting\nworking\nfinished\n")
    story.expect_refusal(f"reader draft {request.id} --save", "could not fill --count", actor=story.agent)
    story.expect_text(f"reader draft {request.id}", "could not fill --count", "building cart", actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).find(request.id).completed_at is None)


def test_draft_save_frees_the_held_worker(draft_sample):
    story, request = draft_sample
    story.run(f"reader draft {request.id} --save", actor=story.agent)
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))


def test_a_worker_can_save_its_own_draft(draft_sample):
    story, request = draft_sample
    story.expect_text(f"reader draft {request.id} --save", "saved reader pytest", actor=reader_worker(story))
    story.expect_rows(not story.container.get(ReaderRequestQuery).has_active_requests(reader_worker(story).id, story.clock.timestamp()))


def test_candidates_fill_an_unrecognized_test_output(draft_sample):
    story, request = draft_sample
    story.container.get(OutputFolder).write_output(request.sample_process_id, 1, "starting\n" * 10 + "3/3\nTests: 3 passed\n")
    story.expect_text(f"reader draft {request.id} --save", "saved reader custom-test-reader", "count: 3", "progress: 100", actor=story.agent)


def test_a_stock_draft_keeps_test_steps(draft_sample):
    story, request = draft_sample
    story.expect_success("reader remove go-test")
    story.container.get(OutputFolder).write_output(request.sample_process_id, 1, "ok  \texample.org/project/tools/runner\t1.723s\n")
    story.expect_text(f"reader draft {request.id} --save", "saved reader go-test", actor=story.agent)
    reader = story.container.get(Queries).query(Reader).filter(name="go-test").page(1, 1).rows[0]
    story.expect_rows("?P<passed>" in reader.step_pattern, "?P<failed>" in reader.step_pattern)


def test_a_vitest_request_saves_vitest_patterns(new_story):
    story = new_story(fixture=ForcedReaders)
    install_runner(story)
    story.expect_success("reader remove vitest")
    process = worker_run(story, "npx vitest run", CommandCategory.TEST_RUN)
    end_run(story, process, " RUN  v2.1.8\n\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n")
    request = story.container.get(ReaderRequestQuery).open().page(1, 1).rows[0]
    story.expect_text(f"reader draft {request.id} --save", "saved reader vitest", actor=story.agent)
    reader = story.container.get(Queries).query(Reader).filter(name="vitest").page(1, 1).rows[0]
    story.expect_rows("Test Files" in reader.lines_pattern, "Tests" in reader.summary_pattern)


def test_a_draft_with_no_matching_lines_does_not_close_the_request(draft_sample):
    story, request = draft_sample
    story.container.get(OutputFolder).write_output(request.sample_process_id, 1, "nothing useful\n")
    story.expect_refusal(f"reader draft {request.id} --save", "--lines picked none", actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).find(request.id).completed_at is None)


@pytest.fixture
def saved_draft(draft_sample):
    story, request = draft_sample
    story.expect_success("reader remove pytest")
    story.expect_success(f"reader draft {request.id} --save", actor=story.agent)
    return story, request


def test_removing_a_reader_clears_ended_history(saved_draft):
    story, request = saved_draft
    process = worker_run(story, "custom-test run", CommandCategory.TEST_RUN)
    end_run(story, process, PYTEST_SAMPLE)
    story.expect_success("reader remove pytest", actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).find(request.id).reader_id is None)


def test_removing_a_reader_used_by_an_alias_is_refused(saved_draft):
    story, request = saved_draft
    story.expect_success('alias add saved-tests "pytest" --reader pytest', actor=story.agent)
    story.expect_refusal("reader remove pytest", "referenced", actor=story.agent)
    story.expect_rows(story.container.get(ReaderRequestQuery).find(request.id).reader_id is not None)
