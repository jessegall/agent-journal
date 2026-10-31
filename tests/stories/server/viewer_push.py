import json

from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import viewer_answer
from tests.stories.server.viewer_pairing import PAIR_LINE, paired_code
from tests.stories.server.support.server_client import server_story

SUBSCRIPTION = {"endpoint": "https://fcm.googleapis.com/fcm/send/abc", "keys": {"p256dh": "x", "auth": "y"}}


def test_a_paired_phone_reads_the_public_key_and_posts_its_subscription(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        _, pairing = paired_code(story)
        phone = story.expect_phone_paired(str(pairing["code"]))
        status, _, body = viewer_answer(story.viewer_port(), "/api/push", phone, "")
        assert status == 200 and len(json.loads(body)["public_key"]) == 87, body
        status, _, body = viewer_answer(story.viewer_port(), "/api/push", phone, "", SUBSCRIPTION)
        assert status == 200 and json.loads(body)["subscribed"] is True, body


def test_a_share_session_gets_403_for_the_key_and_the_subscription(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.context.viewer.login.new_share_key(1))
        story.expect_viewer_status("/api/push", 403, cookie)
        status, _, _ = viewer_answer(story.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)
        assert status == 403


def test_no_session_gets_401(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        story.expect_viewer_status("/api/push", 401)
        status, _, _ = viewer_answer(story.viewer_port(), "/api/push", "", "", SUBSCRIPTION)
        assert status == 401


def test_a_person_at_a_computer_has_no_phone_to_subscribe(new_story):
    with server_story(new_story(fixture=UserJoined)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        status, _, _ = viewer_answer(story.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)
        assert status == 404
