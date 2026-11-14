import json

from tests.integration.support.phone_pairing import paired_code
from tests.integration.support.server_harness import viewer_answer

SUBSCRIPTION = {"endpoint": "https://fcm.googleapis.com/fcm/send/abc", "keys": {"p256dh": "x", "auth": "y"}}
PUBLIC_KEY_LENGTH = 87


def test_a_paired_phone_reads_the_public_key_and_posts_its_subscription(person_server):
    server, _, _ = person_server
    _, pairing = paired_code(server)
    phone = server.expect_phone_paired(str(pairing["code"]))
    status, _, body = viewer_answer(server.viewer_port(), "/api/push", phone, "")
    assert status == 200 and len(json.loads(body)["public_key"]) == PUBLIC_KEY_LENGTH, body
    status, _, body = viewer_answer(server.viewer_port(), "/api/push", phone, "", SUBSCRIPTION)
    assert status == 200 and json.loads(body)["subscribed"] is True, body


def test_a_share_session_gets_403_for_the_key_and_the_subscription(person_server):
    server, _, _ = person_server
    cookie = server.expect_viewer_login(server.context.viewer.login.new_share_key(1))
    server.expect_viewer_status("/api/push", 403, cookie)
    assert viewer_answer(server.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)[0] == 403


def test_no_session_gets_401(person_server):
    server, _, _ = person_server
    server.expect_viewer_status("/api/push", 401)
    assert viewer_answer(server.viewer_port(), "/api/push", "", "", SUBSCRIPTION)[0] == 401


def test_a_person_at_a_computer_has_no_phone_to_subscribe(person_server):
    server, cookie, _ = person_server
    assert viewer_answer(server.viewer_port(), "/api/push", cookie, "", SUBSCRIPTION)[0] == 404
