import pytest

from core.testing.story_fixture import StoryFixture

from datetime import timedelta

from tests.stories.core.modules.processes.support.process_samples import end_run, ended_run, moved_run
from core.modules.processes.support.output_folder import OutputFolder
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_outputs_past_the_number_kept_are_pruned_oldest_first_and_their_folders_go(pruned_short_outputs):
    story, number = pruned_short_outputs
    story.expect_success("output show 2", "state: kept", actor=story.agent)
    story.expect_success("output show 3", "state: kept", actor=story.agent)
    expect_value_11(story, 1, "")
    expect_value_11(story, 3, "make step2")


def test_an_output_is_kept_its_minutes_whatever_the_count_says(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run("setting make journal.core.processes.outputs-kept 1")
    story.run("setting make journal.core.processes.outputs-kept-minutes 30")
    ended_run(story, "make first", "first\n")
    story.advance(timedelta(minutes=29))
    ended_run(story, "make second", "second\n")
    story.expect_success("output show 1", "state: kept", actor=story.agent)
    story.advance(timedelta(minutes=2))
    ended_run(story, "make third", "third\n")
    story.expect_success("output show 1", "state: pruned", actor=story.agent)
    story.expect_success("output show 2", "state: kept", actor=story.agent)


def test_a_long_run_that_ends_after_shorter_ones_is_kept_though_it_started_first(last_ended_output):
    story, long_run, number = last_ended_output
    story.expect_success("output show 2", "state: pruned", actor=story.agent)


def test_an_output_with_a_reader_outlasts_later_outputs_with_none(new_story):
    story = new_story(fixture=TwoKeptOutputs)
    tested = ended_run(story, "pytest -q", "1 passed\n")
    reader = story.new_row_id('reader add tests --commands "pytest*" --lines "FAILED"')
    story.run(f"output edit {tested.id} --reader-id {reader}", actor=story.agent)
    for number in range(2):
        story.advance(timedelta(seconds=1))
        ended_run(story, f"cat note{number}", f"note {number}\n")
    story.expect_success(f"output show {tested.id}", "state: kept", actor=story.agent)
    story.expect_success("output show 2", "state: pruned", actor=story.agent)


class TwoKeptOutputs(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.run('setting make journal.core.processes.outputs-kept 2')
        story.run('setting make journal.core.processes.outputs-kept-minutes 0')


@pytest.fixture
def pruned_short_outputs(new_story):
    story = new_story(fixture=TwoKeptOutputs)
    for number in range(3):
        story.advance(timedelta(seconds=1))
        ended_run(story, f"make step{number}", f"output {number}\n")
    story.expect_success("output show 1", "state: pruned", actor=story.agent)
    return story, number


@pytest.fixture
def last_ended_output(new_story):
    story = new_story(fixture=TwoKeptOutputs)
    long_run = moved_run(story, "make everything")
    for number in range(2):
        story.advance(timedelta(seconds=1))
        ended_run(story, f"cat note{number}", f"note {number}\n")
    story.advance(timedelta(seconds=1))
    end_run(story, long_run, "all passed\n")
    story.expect_success(f"output show {long_run.id}", "state: kept", actor=story.agent)
    return story, long_run, number


def expect_value_11(story, number, expected) -> None:
    actual = story.container.get(OutputFolder).line(number)
    assert actual == expected, actual
