from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder


class HookRecordingEnabled(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
        story.expect_success("setting set journal.core.developer.tools.hooks.request-log true --project", actor=story.user)
