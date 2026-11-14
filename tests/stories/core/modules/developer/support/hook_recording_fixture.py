from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING


class HookRecordingEnabled(StoryFixture):
    """The developer tools with agent calls recorded and what each call cost counted."""

    parent = UserBuilder

    def steps(self, story):
        story.expect_success("setting switch journal.core.developer.tools on --project", actor=story.user)
        story.expect_success(f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", actor=story.user)
        story.expect_success(f"setting set {HOOK_DURATIONS_SETTING} true --project", actor=story.user)
