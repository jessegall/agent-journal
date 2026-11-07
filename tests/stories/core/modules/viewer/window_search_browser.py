from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_task_question_and_file_feed_search_bars_stay_at_the_top_with_a_bottom_border(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    for number in range(30):
        story.hook("s-1", HookSamples.edit(f"src/search_{number}.py", 3, 1).with_fields(event="post_tool_use"))
        story.expect_success(f'task make "Search task {number}" --brief "Search sample" --environment main', actor=story.user)
    story.expect_text("file-edit list", "src/search_29.py", actor=story.agent)
    for number in range(30):
        story.expect_success(f'question ask "Search question {number}?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "windowSearch.browser.mjs", ["/tmp/journal-worker-464-window-search", str(story.agent.id)])
