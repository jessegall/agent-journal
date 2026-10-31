from tests.stories.core.base.chat.support.mark_faults import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_the_marks_on_offer_carry_their_body_url_with_the_registry_fingerprint(new_story):
    with server_story(new_story(f"{PATH}:GoodModule", fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/marks", 200, cookie, text='"type": "good.note"')
        story.expect_viewer_status("/api/marks", 200, cookie, text='"body_url": "/modules/good/note.js?v=')


def test_the_docks_on_offer_list_their_limits_and_reads(new_story):
    with server_story(new_story(f"{PATH}:GoodModule", fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/docks", 200, cookie, text='"most": 1, "leaves_after_seconds": 0, "reads": ["task list"]')


def test_marks_and_docks_are_answered_only_behind_the_login(new_story):
    with server_story(new_story(f"{PATH}:GoodModule", fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/marks", 401)
        story.expect_viewer_status("/api/docks", 401)
