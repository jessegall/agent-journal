from engine.enums.command_category import CommandCategory
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import TwoToxReaders, main_test_run_without_reader, rejected_worker_command, tox_run, worker_test_run_without_reader

PYTEST_SAMPLE = "================ test session starts ================\ncollected 2 items\n\ntests/cart.py .. [100%]\n\n================ 2 passed in 0.04s ================\n"


class ProjectPytestReader(StoryFixture):
    """Required readers are on, the stored stock pytest reader is removed and a project reader that passes a pytest
    output, with no count command, reads every pytest line."""

    parent = ForcedReaders

    def steps(self, story: Story) -> None:
        install_runner(story)
        story.run("reader remove pytest")
        story.run('reader add project-tests --commands "pytest*" --title "Project tests" --lines "passed" --summary "([0-9]+) passed" '
                  '--count "collected ([0-9]+)" --progress "\\[([0-9]+)%\\]"', actor=story.agent)


def test_of_two_readers_of_one_command_the_newest_reads_the_output(new_story):
    story = new_story(fixture=TwoToxReaders)
    process = tox_run(story)
    story.expect_text(f"output read {process.id} --summary", "error two", actor=story.agent)
    story.expect_no_text(f"output read {process.id} --summary", "FAILED one", actor=story.agent)


def test_the_default_reader_of_a_command_reads_the_output_before_a_newer_one(new_story):
    story = new_story(fixture=TwoToxReaders)
    story.run("reader default first", actor=story.agent)
    process = tox_run(story)
    story.expect_text(f"output read {process.id} --summary", "FAILED one", actor=story.agent)
    story.expect_no_text(f"output read {process.id} --summary", "error two", actor=story.agent)


def test_a_worker_test_with_no_reader_is_asked_for_a_reader_that_counts_its_tests(new_story):
    story = new_story(fixture=ForcedReaders)
    worker_test_run_without_reader(story)
    story.expect_text("reader-request show 1", "reason: no reader counts the tests of custom-build run", actor=story.agent)


def test_a_worker_test_whose_reader_counts_its_tests_but_has_no_summary_is_asked_for_nothing(new_story):
    story = new_story(fixture=ForcedReaders)
    story.run('reader add custom --commands "custom-build*" --title "Custom tests" --lines done --step PASSED '
              '--count "collected ([0-9]+)" --count-command "{part} --list"', actor=story.agent)
    worker_run(story, "custom-build run", CommandCategory.TEST_RUN)
    story.expect_success("reader-request list", "nothing found", actor=story.agent)


def test_a_main_agents_own_test_run_with_no_reader_opens_no_reader_request(new_story):
    story = new_story(fixture=ForcedReaders)
    main_test_run_without_reader(story)
    story.expect_success("reader-request list", "nothing found", actor=story.agent)


def test_a_worker_command_rejected_before_it_ran_ends_its_request_with_that_reason(new_story):
    story = new_story(fixture=ForcedReaders)
    rejected_worker_command(story)
    story.expect_text("reader-request show 1 --json", '"skip_reason": "command rejected before it ran"', '"completed_at": "', actor=story.agent)


def test_a_draft_for_a_command_a_stock_reader_matches_offers_the_passing_project_reader_first(new_story):
    story = new_story(fixture=ProjectPytestReader)
    process = worker_run(story, "pytest tests/cart -q", CommandCategory.TEST_RUN)
    end_run(story, process, PYTEST_SAMPLE)
    story.expect_text("reader draft 1", "journal reader add project-tests", actor=story.agent)
    story.expect_no_text("reader draft 1", "journal reader add pytest ", actor=story.agent)
