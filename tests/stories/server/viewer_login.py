from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

FOREIGN_HOST = "journal.example.com"


def test_a_viewer_request_without_the_login_cookie_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/viewer/", 401)


def test_a_login_key_sets_a_cookie_once_and_is_spent(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        key = story.viewer_key("Ada")
        story.expect_viewer_login(key)
        story.expect_viewer_status(f"/?key={key}", 401)


def test_a_login_redirect_keeps_the_query_the_person_opened_and_drops_the_key(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        key = story.viewer_key("Ada")
        story.expect_viewer_login_to(key, "&environment=main&agent=3", "/viewer/?environment=main&agent=3")
        story.expect_viewer_login_to(story.viewer_key("Ada"), "", "/viewer/")


def test_the_cookie_opens_the_viewer_shell_with_its_import_map(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/viewer/", 200, cookie, text='"@journal/window-kit": "/viewer/kit/window-kit.js"')
        story.expect_viewer_headers("/viewer/kit/window-kit.js", cookie, {"Content-Type": "text/javascript"})


def test_a_request_naming_another_host_is_refused_even_with_the_cookie(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/viewer/", 403, cookie, host=FOREIGN_HOST)


def test_an_agent_gets_no_viewer_key(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_key_refusal({"variables": {"JOURNAL_AGENT_SESSION": "s-1"}, "folder": "/"}, 403, "only a person opens the viewer")


def test_a_viewer_key_request_that_is_not_an_object_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_key_refusal(["Ada"], 400, "a caller request is an object")

