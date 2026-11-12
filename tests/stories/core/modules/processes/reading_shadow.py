from engine.enums.command_category import CommandCategory
from engine.query.queries import Queries
from core.modules.processes.models.enums.reading_moment import ReadingMoment
from core.modules.processes.models.reading_decision_row import ReadingDecisionRow
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders
from tests.stories.core.modules.processes.support.reading_scenarios import (TwoToxReaders, end_decision, ended_after_a_while, large_background_output,
                                                                             main_test_run_without_reader, rejected_worker_command, tox_run)
from tests.stories.core.support.coding_fixtures import BuilderStarted

# The end decision the engine keeps for each pin scenario, as (state, action, level), beside what the old code did.
# Two rows disagree with the old code; they are listed in the task log of task 8773.
SHORT_TOX_RUN = (("not needed", "nothing", 1), "the newest of two project readers read it and nothing was said")
WORKER_TESTS_WITHOUT_READER = (("missing", "require", 3), "a reader request was opened and the worker was held until a reader came")
MAIN_TESTS_WITHOUT_READER = (("missing", "suggest", 1), "nothing was said: a main agent's foreground run asks for no reader (differs)")
REJECTED_WORKER_COMMAND = (("not needed", "nothing", 1), "the request ended with the skip reason command rejected before it ran")
MANY_PARTS = 12
MANY_PARTS_LINE = " && ".join(f"tool{number} run" for number in range(1, MANY_PARTS + 1))
SHORT_BACKGROUND_OUTPUT = (("not needed", "nothing", 1), "the ended line said no reader reads make yet (differs)")


def test_a_short_run_two_project_readers_read_needs_no_reader(new_story):
    story = new_story(fixture=TwoToxReaders)
    decision = end_decision(story, tox_run(story))
    story.expect_rows(decision == SHORT_TOX_RUN[0], detail=f"{decision}: {SHORT_TOX_RUN[1]}")


def test_a_main_agents_test_run_with_no_reader_is_suggested_one_at_its_end(new_story):
    story = new_story(fixture=BuilderStarted)
    process = ended_after_a_while(story, main_test_run_without_reader(story))
    decision = end_decision(story, process)
    story.expect_rows(decision == MAIN_TESTS_WITHOUT_READER[0], detail=f"{decision}: {MAIN_TESTS_WITHOUT_READER[1]}")
    story.expect_text(f"process card {process.id} --json", '"reading_text": "Reader: none"', actor=story.agent)


def test_a_rejected_worker_command_needs_no_reader(new_story):
    story = new_story(fixture=ForcedReaders)
    decision = end_decision(story, rejected_worker_command(story))
    story.expect_rows(decision == REJECTED_WORKER_COMMAND[0], detail=f"{decision}: {REJECTED_WORKER_COMMAND[1]}")


def test_a_short_background_run_with_a_large_output_needs_no_reader(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    decision = end_decision(story, large_background_output(story))
    story.expect_rows(decision == SHORT_BACKGROUND_OUTPUT[0], detail=f"{decision}: {SHORT_BACKGROUND_OUTPUT[1]}")


def test_a_line_of_many_parts_reads_the_reading_facts_and_kept_decisions_of_its_parts_once(new_story):
    story = new_story(fixture=BuilderStarted)
    with story.repeated_work.request():
        process = start_process(story, MANY_PARTS_LINE, category=CommandCategory.TEST_RUN)
    kept = tuple(story.container.get(Queries).query(ReadingDecisionRow).filter(process_id=process.id, moment=ReadingMoment.START).all_rows())
    story.expect_rows(len(kept) == MANY_PARTS, detail=str(len(kept)))
