from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import BuilderWithUser


class DevelopmentToolsOn(StoryFixture):
    """A builder and a person with development cost reporting enabled."""

    parent = BuilderWithUser

    def steps(self, story) -> None:
        story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
