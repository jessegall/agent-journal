from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, TOOLS_SETTING
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser


class DeveloperToolsEnabled(StoryFixture):
    """A builder whose developer tools are enabled."""

    parent = BuilderWithUser

    def steps(self, story: Story) -> None:
        story.run(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)

    def expect(self, story: Story) -> None:
        story.expect_success(f"setting show {HOOK_DURATIONS_SETTING}", "value: on", actor=story.user)
