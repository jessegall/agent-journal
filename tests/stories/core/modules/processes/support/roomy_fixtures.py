from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from core.modules.processes.models.enums.process_setting import ProcessSetting
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

ROOMY_LONG_LANE = 1000


def roomy_long_lane(story: Story) -> None:
    story.expect_success(f"setting set {ProcessSetting.LANE_CAPACITY_LONG.key} {ROOMY_LONG_LANE} --environment main", actor=story.user)
    story.expect_success(f"setting set {ProcessSetting.STARTER_CAP_PERCENT.key} 100 --environment main", actor=story.user)


class RoomyBuilderStarted(StoryFixture):
    """BuilderStarted with a long lane that holds every run of a story at once, from any one agent: for stories about
    what a run prints rather than how long it waits."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        roomy_long_lane(story)


class RoomyUserBuilder(StoryFixture):
    """UserBuilder with a long lane that holds every run of a story at once, from any one agent."""

    parent = UserBuilder

    def steps(self, story: Story) -> None:
        roomy_long_lane(story)
