from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.reading_case_samples import ENDED, STARTED, case_of, helper_search, plugin_check
from tests.stories.core.support.coding_fixtures import BuilderStarted

PYTEST_OUTPUT = "================ test session starts ================\ncollected 2 items\n\ntests/cart.py .. [100%]\n\n================ 2 passed in 0.04s ================\n"


def test_a_main_agents_ended_pytest_run_is_read_by_the_stock_reader_with_its_output_measured(new_story):
    story = new_story(fixture=BuilderStarted)
    case = case_of(story, ended_run(story, "pytest tests/cart -q", PYTEST_OUTPUT), ENDED)
    story.expect_rows(case.command_key == "pytest tests/cart -q", case.reader_layer is not None and case.reader_layer.name == "STOCK",
                      case.reader_judgement is not None, case.output is not None and case.output.line_count == 6,
                      not case.role_must_have_reader, case.role_uses_saved_commands, not case.request_is_waiting, detail=repr(case))


def test_a_build_no_reader_reads_has_no_layer_no_judgement_and_no_output_at_its_start(new_story):
    story = new_story(fixture=BuilderStarted)
    case = case_of(story, start_process(story, "custom-build run", category=CommandCategory.BUILD), STARTED)
    story.expect_rows(case.category is CommandCategory.BUILD, case.classification_known, case.reader_layer is None, case.reader_judgement is None,
                      not case.reader_is_default, case.output is None, case.runs_without_change == 0, not case.is_not_needed, detail=repr(case))


def test_a_read_only_helpers_search_needs_no_reader_and_its_role_writes_none(new_story):
    story = new_story(fixture=StartedHelper)
    case = case_of(story, helper_search(story), STARTED)
    story.expect_rows(case.category is CommandCategory.SEARCH, case.is_not_needed, not case.role_must_have_reader, detail=repr(case))


def test_a_workers_test_run_with_no_reader_has_its_request_waiting_and_must_have_a_reader(new_story):
    story = new_story(fixture=ForcedReaders)
    case = case_of(story, worker_run(story, "custom-build run"), STARTED)
    story.expect_rows(case.request_is_waiting, case.role_must_have_reader, case.readers_forced, not case.role_uses_saved_commands, detail=repr(case))


def test_a_plugin_run_needs_no_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    process = plugin_check(story)
    end_run(story, process, "lint clean\n")
    case = case_of(story, process, ENDED)
    story.expect_rows(case.is_plugin_run, case.is_not_needed, case.output is not None and case.output.byte_count > 0, detail=repr(case))


TICK = timedelta(seconds=10)
