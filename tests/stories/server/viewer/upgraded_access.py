from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.version_four import SHARE_TOKEN
from tests.stories.server.support.server_client import server_story, viewer_answer

PAIR_LINE = {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}
SHARE_PATH = "/viewer/share/"


def test_after_the_upgrade_a_phone_is_paired_again_and_logs_in_as_the_person(new_story):
    with server_story(upgraded_story(new_story)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Jesse"))
        pairing = story.viewer_line_value(cookie, PAIR_LINE)
        phone = story.expect_phone_paired(str(pairing["code"]))
        story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')


def test_after_the_upgrade_a_version_4_share_link_opens_as_the_second_person_with_the_same_token(new_story):
    with server_story(upgraded_story(new_story)) as story:
        status, headers, body = viewer_answer(story.viewer_port(), f"{SHARE_PATH}{SHARE_TOKEN}", "", "")
        cookie = headers.get("Set-Cookie", "")
        assert status == 200 and '<div id="app">' in body and cookie.startswith("journal_share="), (status, headers)
        story.expect_viewer_status("/api/session", 200, cookie.split(";", 1)[0], text='"type": "share"')
