from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.browser_story import expect_browser
from tests.stories.server.support.server_client import server_story
from core.modules.viewer.commands.support.window_setting_keys import TOUR_COMPLETED


def test_a_blocked_task_in_a_chain_shows_what_waits_on_what_in_its_inspector(new_story):
    story = new_story(fixture=UserJoined)
    story.run(f"setting set {TOUR_COMPLETED} true --project")
    for title in ("one", "two", "three", "four", "five"):
        story.run(f'task make "Task {title}" --brief "Part of a chain" --environment main')
    for waiting, blocker in ((2, 1), (3, 2), (4, 3), (5, 4)):
        story.run(f"task block {waiting} --on task:{blocker}", actor=story.agent)
    with server_story(story) as server:
        expect_browser(server, "taskChain.browser.mjs", ["/tmp/journal-worker-681-task-chain"])
