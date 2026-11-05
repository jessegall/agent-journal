from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story


def test_a_docked_task_and_a_docked_memory_show_their_rows(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    task = story.new_row_id('task make "Fix the cart" --environment main', actor=story.agent)
    memory = story.new_row_id('memory make "The cart total is in cents" --weight 7 --environment main', actor=story.agent)
    story.expect_success(f"dock add tasks.task task {task} --environment main", actor=story.agent)
    story.expect_success(f"dock add memories.memory memory {memory} --environment main", actor=story.agent)
    story.expect_success('actor make user "Ada"')
    with server_story(story) as server:
        expect_browser(server, "dockBodies.browser.mjs", [])
