import base64
import json

from engine.actor.actor import Actor
from core.modules.phone.ticks.phone_notices import PhoneNotices
from engine.time.clock import Clock
from engine.command.bus import Bus
from core.modules.tunnel.support.tunnels import Tunnels
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.support.p256 import P256
from tests.stories.core.modules.phone.phone_rows import TOKEN_DIGEST, paired_story
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_endswith_authorization, expect_value
from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_handler import PRIVATE_KEY
from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_handler import PUBLIC_KEY

ENDPOINT = "https://fcm.googleapis.com/fcm/send/abc"
SUBSCRIPTION = json.dumps({"endpoint": ENDPOINT, "keys": {"p256dh": "x", "auth": "y"}})
PUBLIC = f"{PUBLIC_KEY}"
PRIVATE = f"{PRIVATE_KEY}"


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
    story.replace(PushService, service or FakePush())
    story.expect_success(f"phone subscribe {TOKEN_DIGEST} '{SUBSCRIPTION}'", actor=Actor.core())
    return story


def helper_question(story) -> None:
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.run_listeners()


def tick(story) -> None:
    PhoneNotices()(story.container)


def test_the_key_pair_is_made_on_first_need_and_kept_as_two_secret_settings(new_story):
    story = new_story(fixture=UserJoined)
    first = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    expect_value(len(base64.urlsafe_b64decode(first + '=' * (-len(first) % 4))), 65)
    expect_value(bool(first.startswith(('0x', '{'))), False)
    expect_value(story.run('phone push-key', actor=Actor.core()).output_text.strip(), first)
    for key in (PUBLIC, PRIVATE):
        shown = story.run(f"setting show {key}", actor=story.user)
        shown.expect_text(key)
        shown.expect_no_text(first)
        shown.expect_text("set")


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
    story.replace(PushService, service)
    helper_question(story)
    tick(story)
    expect_row(service, sent=[])


def test_a_failed_push_keeps_the_subscription_for_the_next_notice(new_story):
    service = FakePush(status=500)
    story = subscribed_story(new_story, service)
    helper_question(story)
    tick(story)
    helper_question(story)
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
    story.replace(PushTransport, transport)
    story.replace(Tunnels, FakeTunnels(address))
    return transport, WebPush(story.container.get(Bus), story.container.get(Tunnels), story.container.get(Clock), transport)


def test_the_real_push_sends_an_empty_request_signed_with_the_kept_keys_and_the_tunnels_address(new_story):
    story = paired_story(new_story)
    requests, service = built_service(story, "journal.example.test")
    expect_value(service.send(ENDPOINT), 201)
    [(endpoint, headers)] = requests.posts
    public = story.run("phone push-key", actor=Actor.core()).output_text.strip()
    authorization = headers["Authorization"]
    token = authorization.split("vapid t=", 1)[1].split(",", 1)[0]
    head, claims, signature = token.split(".")
    expect_endswith_authorization(authorization, f"k={public}")
    expect_value(endpoint, ENDPOINT)
    expect_value(headers['Content-Length'], '0')
    expect_row(json.loads(base64.urlsafe_b64decode(claims + "=" * (-len(claims) % 4))), sub="https://journal.example.test")
    raw_public = base64.urlsafe_b64decode(public + "=" * (-len(public) % 4))
    expect_value(bool(P256.is_signed(raw_public, f'{head}.{claims}'.encode(), base64.urlsafe_b64decode(signature + '=' * (-len(signature) % 4)))), True)

