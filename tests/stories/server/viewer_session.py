from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story


def test_the_session_route_answers_a_person_cookie_with_its_kind_and_person(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/session", 200, cookie, text='"type": "person"')


def test_the_session_route_answers_no_cookie_with_401(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/session", 401)
