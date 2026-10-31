import base64
import json

from core.base.actor import Actor
from server.tick_work import TickWork
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.modules.phone.support.push_keys import PushKeys
from core.modules.tunnel.support.tunnels import Tunnels
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.support.p256 import P256
from tests.stories.core.modules.phone.phone_rows import TOKEN_DIGEST, paired_story
from tests.stories.core.support.fixtures import UserJoined

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
    story.run('question ask "Which database?" --environment main', actor=story.agent)
    story.run_listeners()


def tick(story) -> None:
    TickWork().run(story.container)


def test_the_key_pair_is_made_on_first_need_and_kept_as_two_secret_settings(new_story):
    story = new_story(fixture=UserJoined)
    first = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    assert len(base64.urlsafe_b64decode(first + "=" * (-len(first) % 4))) == 65 and not first.startswith(("0x", "{"))
    assert story.run("phone push-key", actor=Actor.core()).output_text.strip() == first
    for key in (PUBLIC, PRIVATE):
        shown = story.run(f"setting show {key}", actor=story.user).output_text
        assert key in shown and first not in shown and "set" in shown


def test_a_signature_made_with_a_secret_verifies_against_its_public_key():
    pair = PushKeys(int("c0ffee", 16))
    token = pair.token(ENDPOINT, "https://example.test", 1000.0)
    head, claims, signature = token.split(".")
    raw = base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4))
    assert P256.is_signed(pair.public, f"{head}.{claims}".encode(), raw)
    assert not P256.is_signed(pair.public, f"{head}.{claims}x".encode(), raw)


def test_a_phone_subscription_is_kept_and_never_shown(new_story):
    story = subscribed_story(new_story)
    assert ENDPOINT not in story.run("phone show 1", actor=story.user).output_text
    assert ENDPOINT not in story.run("event list --json", actor=story.user).output_text


def test_a_question_asked_only_records_the_notice_and_the_ticker_round_pushes_the_subscribed_phone_once(new_story):
    service = FakePush()
    story = subscribed_story(new_story, service)
    ask(story)
    story.run_listeners()
    assert service.sent == []
    tick(story)
    assert service.sent == [ENDPOINT]
    tick(story)
    assert service.sent == [ENDPOINT]


def test_two_notices_before_a_round_make_one_push(new_story):
    service = FakePush()
    story = subscribed_story(new_story, service)
    ask(story)
    ask(story)
    tick(story)
    assert service.sent == [ENDPOINT]


def test_a_plan_made_ready_is_pushed_by_the_ticker_round(new_story):
    service = FakePush()
    story = subscribed_story(new_story, service)
    story.run('plan make "Checkout" --environment main', actor=story.user)
    story.run_listeners()
    tick(story)
    assert service.sent == []
    story.expect_success("plan ready 1", actor=story.user)
    story.run_listeners()
    assert service.sent == []
    tick(story)
    assert service.sent == [ENDPOINT]


def test_a_phone_that_never_subscribed_is_not_pushed(new_story):
    service = FakePush()
    story = paired_story(new_story)
    story.container.bind(PushService, service)
    ask(story)
    tick(story)
    assert service.sent == []


def test_an_unpaired_phone_is_not_pushed(new_story):
    service = FakePush()
    story = subscribed_story(new_story, service)
    story.expect_success("phone unpair 1", actor=story.user)
    ask(story)
    tick(story)
    assert service.sent == []


def test_a_push_service_that_no_longer_knows_the_phone_clears_its_subscription(new_story):
    service = FakePush(status=410)
    story = subscribed_story(new_story, service)
    ask(story)
    tick(story)
    assert service.sent == [ENDPOINT]
    ask(story)
    tick(story)
    assert service.sent == [ENDPOINT]


def test_a_failed_push_keeps_the_subscription_for_the_next_notice(new_story):
    service = FakePush(status=500)
    story = subscribed_story(new_story, service)
    ask(story)
    tick(story)
    ask(story)
    tick(story)
    assert service.sent == [ENDPOINT, ENDPOINT]


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
    assert service.send(ENDPOINT) == 201
    [(endpoint, headers)] = requests.posts
    public = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    authorization = headers["Authorization"]
    token = authorization.split("vapid t=", 1)[1].split(",", 1)[0]
    head, claims, signature = token.split(".")
    assert authorization.endswith(f"k={public}") and endpoint == ENDPOINT and headers["Content-Length"] == "0"
    assert json.loads(base64.urlsafe_b64decode(claims + "=" * (-len(claims) % 4)))["sub"] == "https://journal.example.test"
    raw_public = base64.urlsafe_b64decode(public + "=" * (-len(public) % 4))
    assert P256.is_signed(raw_public, f"{head}.{claims}".encode(), base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4)))


def test_the_real_push_sends_only_to_a_known_push_service_and_only_with_a_tunnel_address(new_story):
    story = paired_story(new_story)
    requests, service = built_service(story, "journal.example.test")
    assert service.send("https://evil.example.test/push") == 0 and service.send("http://fcm.googleapis.com/x") == 0 and requests.posts == []
    requests, service = built_service(story, None)
    assert service.send(ENDPOINT) == 0 and requests.posts == []
