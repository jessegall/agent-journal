from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper
from tests.stories.core.modules.processes.support.cadence_probe import cadence_tick, has_cadence_record, emitted, ring
from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, moved_run, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.reading_case_samples import ENDED, RUNNING, STARTED, case_of, helper_search, plugin_check
from tests.stories.core.support.coding_fixtures import BuilderStarted

PYTEST_OUTPUT = "================ test session starts ================\ncollected 2 items\n\ntests/cart.py .. [100%]\n\n================ 2 passed in 0.04s ================\n"


def test_a_main_agents_ended_pytest_run_is_read_by_the_stock_reader_with_its_output_measured(new_story):
    story = new_story(fixture=BuilderStarted)
    case = case_of(story, ended_run(story, "pytest tests/cart -q", PYTEST_OUTPUT), ENDED)
    story.expect_rows(case.command_key == "pytest tests/cart -q", case.reader_layer is not None and case.reader_layer.name == "STOCK",
                      case.reader_judgement is not None, case.output is not None and case.output.line_count == 6,
                      not case.reader_required, case.role_uses_saved_commands, not case.waiting_request, detail=repr(case))


def test_a_build_no_reader_reads_has_no_layer_no_judgement_and_no_output_at_its_start(new_story):
    story = new_story(fixture=BuilderStarted)
    case = case_of(story, start_process(story, "custom-build run", category=CommandCategory.BUILD), STARTED)
    story.expect_rows(case.category is CommandCategory.BUILD, case.classification_recognized, case.reader_layer is None, case.reader_judgement is None,
                      not case.default_reader, case.output is None, case.runs_without_change == 0, not case.is_not_needed, detail=repr(case))


def test_a_read_only_helpers_search_needs_no_reader_and_its_role_writes_none(new_story):
    story = new_story(fixture=StartedHelper)
    case = case_of(story, helper_search(story), STARTED)
    story.expect_rows(case.category is CommandCategory.SEARCH, case.is_not_needed, not case.reader_required, detail=repr(case))


def test_a_workers_test_run_with_no_reader_has_its_request_waiting_and_must_have_a_reader(new_story):
    story = new_story(fixture=ForcedReaders)
    case = case_of(story, worker_run(story, "custom-build run"), STARTED)
    story.expect_rows(case.waiting_request, case.reader_required, case.readers_forced, not case.role_uses_saved_commands, detail=repr(case))


def test_a_plugin_run_needs_no_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    process = plugin_check(story)
    end_run(story, process, "lint clean\n")
    case = case_of(story, process, ENDED)
    story.expect_rows(case.is_plugin_run, case.is_not_needed, case.output is not None and case.output.byte_count > 0, detail=repr(case))


TICK = timedelta(seconds=10)


def test_the_case_of_a_run_has_its_cadence_and_a_prompt_is_interactive_only_once_the_output_stops_growing(new_story):
    story = new_story(fixture=BuilderStarted)
    silent = moved_run(story, "make package", CommandCategory.BUILD)
    talking = moved_run(story, "make build", CommandCategory.BUILD)
    asking = moved_run(story, "make install", CommandCategory.BUILD)
    emitted(story, asking, "Installing\nProceed (y/n)?")
    text = ""
    for step in range(4):
        text += f"step {step}\n"
        emitted(story, talking, text)
        cadence_tick(story)
        story.advance(TICK)
    silent_case, talking_case, printing = case_of(story, silent, RUNNING), case_of(story, talking, RUNNING), case_of(story, asking, RUNNING)
    for _ in range(9):
        story.advance(TICK)
        cadence_tick(story)
    waiting = case_of(story, asking, RUNNING)
    story.expect_rows(len(ring(story, talking)) == 4, ring(story, silent) == (), has_cadence_record(story, silent),
                      silent_case.cadence_state == "no output", talking_case.cadence_state == "streaming",
                      printing.output is not None and printing.output.ends_with_prompt, printing.cadence_state == "streaming", printing.unreadable_reason is None,
                      waiting.cadence_state == "stopped writing", waiting.unreadable_reason == "interactive", detail=f"{silent_case!r} {talking_case!r} {printing!r} {waiting!r}")
    story.expect_text(f"output read {asking.id} --tail 1", "Proceed (y/n)?", actor=story.agent)
    story.expect_text(f"process show {asking.id}", "state:", actor=story.agent)
