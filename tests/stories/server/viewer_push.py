from tests.stories.server.support.server_fixtures import person_server

import pytest

import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import viewer_answer
from tests.stories.server.viewer_pairing import PAIR_LINE, paired_code
from tests.stories.server.support.server_client import server_story
from tests.stories.support.story_checks import expect_value

SUBSCRIPTION = {"endpoint": "https://fcm.googleapis.com/fcm/send/abc", "keys": {"p256dh": "x", "auth": "y"}}


def test_a_paired_phone_reads_the_public_key_and_posts_its_subscription(person_server):
    story = person_server
    _, pairing = paired_code(story)
    phone = story.expect_phone_paired(str(pairing["code"]))
    status, _, body = viewer_answer(story.viewer_port(), "/api/push", phone, "")
    expect_value(status, 200)
    expect_public_key(body, 87)
    status, _, body = viewer_answer(story.viewer_port(), "/api/push", phone, "", SUBSCRIPTION)
    expect_value(status, 200)
    expect_subscribed(body, True)


def test_a_share_session_gets_403_for_the_key_and_the_subscription(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.context.viewer.login.new_share_key(1))
    story.expect_viewer_status("/api/push", 403, cookie)
    status, _, _ = viewer_answer(story.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)
    expect_value(status, 403)


def test_no_session_gets_401(person_server):
    story = person_server
    story.expect_viewer_status("/api/push", 401)
    status, _, _ = viewer_answer(story.viewer_port(), "/api/push", "", "", SUBSCRIPTION)
    expect_value(status, 401)


def test_a_person_at_a_computer_has_no_phone_to_subscribe(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    status, _, _ = viewer_answer(story.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)
    expect_value(status, 404)


def expect_subscribed(body, expected) -> None:
    actual = json.loads(body)['subscribed']
    assert actual is expected, actual


def expect_public_key(body, expected) -> None:
    actual = len(json.loads(body)['public_key'])
    assert actual == expected, actual
