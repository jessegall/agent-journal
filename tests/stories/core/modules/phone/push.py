import base64
import json

from engine.actor.actor import Actor
from core.modules.phone.ticks.phone_notices import PhoneNotices
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.modules.phone.support.push_keys import PushKeys
from core.modules.tunnel.support.tunnels import Tunnels
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.support.p256 import P256
from tests.stories.core.modules.phone.phone_rows import TOKEN_DIGEST, paired_story
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_endswith_authorization, expect_value

ENDPOINT = "https://fcm.googleapis.com/fcm/send/abc"
SUBSCRIPTION = json.dumps({"endpoint": ENDPOINT, "keys": {"p256dh": "x", "auth": "y"}})
PUBLIC = "journal.core.phone.push-public-key"
PRIVATE = "journal.core.phone.push-private-key"


class FakePush(PushService):
    def __init__(self, status: int = 201) -> None:
        self.sent, self.status = [], status

    def send(self, endpoint: str) -> int:
        self.sent.append(endpoint)
        return self.status


class FakeTransport(PushTransport):
    def __init__(self) -> None:
        self.posts = []

    def post(self, endpoint: str, headers: dict[str, str]) -> int:
        self.posts.append((endpoint, headers))
        return 201


def subscribed_story(new_story, service: FakePush | None = None):
    story = paired_story(new_story)
    story.container.bind(PushService, service or FakePush())
    story.expect_success(f"phone subscribe {TOKEN_DIGEST} '{SUBSCRIPTION}'", actor=Actor.core())
    return story


def ask(story) -> None:
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.run_listeners()


def tick(story) -> None:
    PhoneNotices()(story.container)


def test_the_key_pair_is_made_on_first_need_and_kept_as_two_secret_settings(new_story):
    story = new_story(fixture=UserJoined)
    first = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    expect_urlsafe_b64decode_base64(first, "=", 4, 65)
    expect_absent_startswith(first, "0x", "{")
    expect_output_7(story, "phone push-key", first)
    for key in (PUBLIC, PRIVATE):
        shown = story.run(f"setting show {key}", actor=story.user)
        shown.expect_text(key)
        shown.expect_no_text(first)
        shown.expect_text("set")


def test_a_signature_made_with_a_secret_verifies_against_its_public_key():
    pair = PushKeys(int("c0ffee", 16))
    token = pair.token(ENDPOINT, "https://example.test", 1000.0)
    head, claims, signature = token.split(".")
    raw = base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4))
    expect_signed_p256_2(P256, pair, f"{head}.{claims}", raw)
    expect_absent_signed_p256(P256, pair, f"{head}.{claims}x", raw)


def test_a_phone_subscription_is_kept_and_never_shown(new_story):
    story = subscribed_story(new_story)
    story.expect_no_text("phone show 1", ENDPOINT, actor=story.user)
    story.expect_no_text("event list --json", ENDPOINT, actor=story.user)


def test_a_plan_made_ready_is_pushed_by_the_ticker_round(new_story):
    service = FakePush()
    story = subscribed_story(new_story, service)
    story.run('plan make "Checkout" --environment main', actor=story.user)
    story.run_listeners()
    tick(story)
    expect_row(service, sent=[])
    story.expect_success("plan ready 1", actor=story.user)
    story.run_listeners()
    expect_row(service, sent=[])
    tick(story)
    expect_row(service, sent=[ENDPOINT])


def test_a_phone_that_never_subscribed_is_not_pushed(new_story):
    service = FakePush()
    story = paired_story(new_story)
    story.container.bind(PushService, service)
    ask(story)
    tick(story)
    expect_row(service, sent=[])


def test_a_failed_push_keeps_the_subscription_for_the_next_notice(new_story):
    service = FakePush(status=500)
    story = subscribed_story(new_story, service)
    ask(story)
    tick(story)
    ask(story)
    tick(story)
    expect_row(service, sent=[ENDPOINT, ENDPOINT])


class FakeTunnel:
    def __init__(self, address: str | None) -> None:
        self.found = address

    def address(self) -> str | None:
        return self.found


class FakeTunnels(Tunnels):
    def __init__(self, address: str | None) -> None:
        self.tunnel = FakeTunnel(address)

    def chosen(self) -> FakeTunnel:  # type: ignore[override]
        return self.tunnel


def built_service(story, address: str | None):
    from core.modules.phone.push.web_push import WebPush

    transport = FakeTransport()
    story.container.bind(PushTransport, transport)
    story.container.bind(Tunnels, FakeTunnels(address))
    return transport, WebPush(story.container.get(Bus), story.container.get(Tunnels), story.container.get(Clock), transport)


def test_the_real_push_sends_an_empty_request_signed_with_the_kept_keys_and_the_tunnels_address(new_story):
    story = paired_story(new_story)
    requests, service = built_service(story, "journal.example.test")
    expect_delivery_status(service, ENDPOINT, 201)
    [(endpoint, headers)] = requests.posts
    public = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    authorization = headers["Authorization"]
    token = authorization.split("vapid t=", 1)[1].split(",", 1)[0]
    head, claims, signature = token.split(".")
    expect_endswith_authorization(authorization, f"k={public}")
    expect_value(endpoint, ENDPOINT)
    expect_content_length_headers(headers, "0")
    expect_row(json.loads(base64.urlsafe_b64decode(claims + "=" * (-len(claims) % 4))), sub="https://journal.example.test")
    raw_public = base64.urlsafe_b64decode(public + "=" * (-len(public) % 4))
    expect_signed_p256(P256, raw_public, f"{head}.{claims}", signature, "=", 4)


def expect_delivery_status(service, item, expected) -> None:
    actual = service.send(item)
    assert actual == expected, actual


def expect_signed_p256(item, raw_public, text, signature, text_2, number) -> None:
    actual = item.is_signed(raw_public, text.encode(), base64.urlsafe_b64decode(signature + text_2 * (-len(signature) % number)))
    assert actual, actual


def expect_content_length_headers(headers, expected) -> None:
    actual = headers['Content-Length']
    assert actual == expected, actual


def expect_absent_signed_p256(item, pair, text, raw) -> None:
    actual = item.is_signed(pair.public, text.encode(), raw)
    assert not actual, actual


def expect_signed_p256_2(item, pair, text, raw) -> None:
    actual = item.is_signed(pair.public, text.encode(), raw)
    assert actual, actual


def expect_output_7(story, text, expected) -> None:
    actual = story.run(text, actor=Actor.core()).output_text.strip()
    assert actual == expected, actual


def expect_urlsafe_b64decode_base64(first, text, number, expected) -> None:
    actual = len(base64.urlsafe_b64decode(first + text * (-len(first) % number)))
    assert actual == expected, actual


def expect_absent_startswith(first, text, text_2) -> None:
    actual = first.startswith((text, text_2))
    assert not actual, actual
