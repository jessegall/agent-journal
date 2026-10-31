from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

FOREIGN_HOST = "journal.example.com"
PHONE_FILES = {"/viewer/phone-sw.js": "text/javascript", "/viewer/manifest.webmanifest": "application/manifest+json",
               "/viewer/icon-180.png": "image/png", "/viewer/icon-192.png": "image/png", "/viewer/icon-512.png": "image/png"}


def test_the_phone_files_are_served_with_their_types_without_a_session(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        for path, content_type in PHONE_FILES.items():
            story.expect_viewer_headers(path, "", {"Content-Type": content_type})


def test_the_phone_worker_may_control_the_whole_viewer(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_headers("/viewer/phone-sw.js", "", {"Service-Worker-Allowed": "/"})


def test_the_manifest_opens_the_viewer_as_an_app_with_the_dark_theme(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/viewer/manifest.webmanifest", 200, text='"display": "standalone"')
        story.expect_viewer_status("/viewer/manifest.webmanifest", 200, text='"theme_color": "#131416"')


def test_a_phone_file_asked_for_by_another_host_is_refused(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/viewer/phone-sw.js", 403, host=FOREIGN_HOST)


def test_the_waiting_list_is_answered_only_behind_the_login(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/waiting", 401)
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        story.expect_viewer_status("/api/waiting", 200, cookie, text='"waiting": []')
