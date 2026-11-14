from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.process_samples import start_process
from tests.stories.core.modules.processes.support.roomy_fixtures import RoomyUserBuilder

PREVIEW = "queue-class preview --pattern"


class RecentRuns(StoryFixture):
    """Seven test runs a second apart, then a build."""

    parent = RoomyUserBuilder

    def steps(self, story: Story) -> None:
        for number in range(7):
            start_process(story, f"pytest tests/test_{number}.py", category=CommandCategory.TEST_RUN)
            story.advance(timedelta(seconds=1))
        start_process(story, "make build", category=CommandCategory.BUILD)


def preview_story(new_story):
    return new_story(fixture=RecentRuns)


def test_a_preview_lists_the_five_newest_lines_the_class_would_match(new_story):
    story = preview_story(new_story)
    story.expect_text(f"{PREVIEW} '^pytest '", "5 recent lines would have matched:", "pytest tests/test_6.py", "pytest tests/test_2.py", actor=story.user)
    story.expect_no_text(f"{PREVIEW} '^pytest '", "pytest tests/test_1.py", actor=story.user)


def test_a_preview_matches_as_the_class_table_does(new_story):
    story = preview_story(new_story)
    story.expect_text(f"{PREVIEW} 'build$'", "1 recent lines would have matched:", "make build", actor=story.user)


def test_a_preview_that_matches_nothing_says_so(new_story):
    story = preview_story(new_story)
    story.expect_text(f"{PREVIEW} '^cargo '", "no recent line would have matched", actor=story.user)
