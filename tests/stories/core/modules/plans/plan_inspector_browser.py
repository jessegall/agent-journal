from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_plan_and_task_inspectors_share_layout_comments_and_status_icons_at_both_widths(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f'setting set {TOUR_COMPLETED} true --project')
    story.run('plan make "Rebuild the cart and its checkout with a title that wraps on a phone" --brief "The cart must keep its totals when the customer changes a quantity." --environment main')
    story.run('phase make --plan 1 "Build the cart and check the checkout totals" --goal "Totals stay correct" --checkpoint')
    for title in ("Open task", "Started task", "Testing task", "Blocked task", "Completed task", "Cancelled task"):
        story.run(f'task make "{title}" --brief "Check the cart totals" --phase 1 --environment main')
    story.run('task start 2', actor=story.agent)
    story.run('task start 3', actor=story.agent)
    story.run('task test 3', actor=story.agent)
    story.run('task block 4 --reason "Waiting on the cart"', actor=story.agent)
    story.run('task start 5', actor=story.agent)
    story.run('task close 5 --outcome "Totals checked"', actor=story.agent)
    story.run('task cancel 6 --reason "Already covered"', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "planInspector.browser.mjs", ["/tmp/journal-worker-541-inspector"])
