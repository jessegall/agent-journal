from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_activity_groups_agent_events_and_animates_new_items(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    story.hook("s-1", HookSamples.prompt("First instruction"))
    story.hook("s-1", HookSamples.prompt("Second instruction"))
    story.expect_text("event list --limit 30", "hook_call.", actor=story.user)
    with server_story(story) as server:
        expect_browser(server, "activity.browser.mjs", ["/tmp/journal-worker-481-activity.png"])
