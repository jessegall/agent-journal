from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_every_seeded_row_opens_in_the_shared_inspector_with_its_declared_head_and_actions(new_story):
    story = new_story(fixture=UserJoined)
    story.run("setting set journal.core.viewer.tour-completed true --project")
    story.run('plan make "Rebuild the cart" --brief "The cart must keep its totals." --environment main')
    story.run('phase make --plan 1 "Build the cart" --goal "Totals stay correct"')
    story.run('task make "Fix the totals" --brief "Check the cart totals" --phase 1 --environment main')
    story.run("task start 1", actor=story.agent)
    story.run('doc make "Cart rules" --abstract "How the cart counts money" --body "in cents"', actor=story.user)
    story.run('report make "The totals" --abstract "The totals" --body "Sums" --environment main', actor=story.agent)
    story.run('question ask "Which database?" --context "A story asks this so its card can be checked." --options sqlite postgres --environment main', actor=story.agent)
    story.run('memory make "Keep the totals in cents" --weight 5 --environment main', actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "inspectors.browser.mjs", ["/tmp/journal-worker-696-inspectors"])
