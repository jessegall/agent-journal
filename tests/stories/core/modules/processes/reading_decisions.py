from datetime import timedelta

from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.modules.processes.support.reading_decision_samples import ReadingMoment, stored_missing_reader, stored_suitable_reader
from tests.stories.core.support.coding_fixtures import BuilderStarted


class BuildWithStartDecision(StoryFixture):
    """A make build moved to the background, and the engine kept at its start that it has no reader."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        stored_missing_reader(story, moved_run(story, "make build"), ReadingMoment.START)


def test_a_kept_decision_is_read_back_with_its_part_moment_and_reason(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.expect_text("reading-decision show 1", "process_id: 1", "part_position: 1", "command_key: make build", "moment: start",
                      "state: missing", "action: require", "level: 2", "reason: reader missing", actor=story.agent)


def test_a_second_decision_for_the_same_moment_replaces_the_first_and_an_end_decision_is_kept_beside_it(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.advance(timedelta(seconds=5))
    process = moved_run(story, "make build")
    stored_suitable_reader(story, process, ReadingMoment.START)
    stored_missing_reader(story, process, ReadingMoment.START)
    stored_suitable_reader(story, process, ReadingMoment.END)
    story.expect_text("reading-decision show 2", "moment: start", "state: missing", actor=story.agent)
    story.expect_text("reading-decision show 3", "moment: end", "state: suitable", actor=story.agent)
    story.expect_refusal("reading-decision show 4", "no reading-decision 4", actor=story.agent)
