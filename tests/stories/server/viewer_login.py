from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

FOREIGN_HOST = "journal.example.com"


def test_a_viewer_request_without_the_login_cookie_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/viewer/", 401)


def test_a_login_key_sets_a_cookie_once_and_is_spent(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        key = story.viewer_key(story.story.user.id)
        story.expect_viewer_login(key)
        story.expect_viewer_status(f"/?key={key}", 401)


def test_the_cookie_names_the_person_and_opens_the_viewer(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key(story.story.user.id))
        story.expect_viewer_status("/viewer/", 200, cookie, text=f'"person_id": {story.story.user.id}')


def test_a_request_naming_another_host_is_refused_even_with_the_cookie(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key(story.story.user.id))
        story.expect_viewer_status("/viewer/", 403, cookie, host=FOREIGN_HOST)
