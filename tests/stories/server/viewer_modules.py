from tests.stories.core.modules.viewer.support.window_samples import NOTES
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

SANDBOX_POLICY = "sandbox allow-scripts; default-src 'none'"


def test_a_module_file_outside_its_web_dist_is_refused(new_story):
    with server_story(new_story(NOTES, fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key(story.story.user.id))
        story.expect_viewer_status("/modules/notes/../../window_samples.py", 404, cookie)


def test_a_frame_windows_file_is_served_with_its_type_nosniff_and_the_sandbox_policy(new_story):
    with server_story(new_story(NOTES, fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key(story.story.user.id))
        story.expect_viewer_headers("/modules/notes/board.html", cookie, {"Content-Type": "text/html", "X-Content-Type-Options": "nosniff",
                                                                         "Content-Security-Policy": SANDBOX_POLICY})


def test_the_windows_on_offer_carry_the_registry_fingerprint_in_their_entry_url(new_story):
    with server_story(new_story(NOTES, fixture=UserJoined)) as story:
        story.story.run("suite choose notes --environment main")
        cookie = story.expect_viewer_login(story.viewer_key(story.story.user.id))
        story.expect_viewer_status("/api/windows?environment=main", 200, cookie, text='"entry_url": "/modules/notes/board.html?v=')
