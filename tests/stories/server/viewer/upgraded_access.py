from tests.stories.server.support.server_fixtures import upgraded_server

import pytest

from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.fixtures.version_four import SHARE_TOKEN
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_startswith_listed, expect_value, expect_value_with

PAIR_LINE = {"window": "phone.phones", "line": ["phone", "pair"], "environment": "main"}
SHARE_PATH = "/viewer/share/"


def test_after_the_upgrade_a_phone_is_paired_again_and_logs_in_as_the_person(upgraded_server):
    story = upgraded_server
    cookie = story.expect_viewer_login(story.viewer_key("Jesse"))
    pairing = story.viewer_line_value(cookie, PAIR_LINE)
    phone = story.expect_phone_paired(str(pairing["code"]))
    story.expect_viewer_status("/api/session", 200, phone, text='"type": "phone"')


def test_after_the_upgrade_a_version_4_share_link_opens_as_the_second_person_with_the_same_token(upgraded_server):
    story = upgraded_server
    status, headers, body = viewer_answer(story.viewer_port(), f"{SHARE_PATH}{SHARE_TOKEN}", "", "")
    cookie = headers.get("Set-Cookie", "")
    expect_value(status, 200)
    expect_value_with(body, '<div id="app">')
    expect_startswith_listed(cookie, "journal_share=")
    story.expect_viewer_status("/api/session", 200, cookie.split(";", 1)[0], text='"type": "share"')
