from tests.stories.support.story_checks import expect_value
import base64
import json

from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_handler import PRIVATE_KEY
from core.modules.phone.commands.ensure_push_keys.ensure_push_keys_handler import PUBLIC_KEY
from core.modules.phone.support.p256 import P256
from core.modules.phone.support.push_keys import PushKeys
from core.modules.phone.support.push_service import PushService
from core.modules.phone.support.push_transport import PushTransport
from core.modules.phone.ticks.phone_notices import PhoneNotices
from core.modules.tunnel.support.tunnels import Tunnels
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.time.clock import Clock
from tests.stories.core.modules.phone.phone_rows import TOKEN_DIGEST, paired_story

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


def ask(story) -> None:
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.run_listeners()


def tick(story) -> None:
    PhoneNotices()(story.container)


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


def test_a_signature_made_with_a_secret_verifies_against_its_public_key():
    pair = PushKeys(int("c0ffee", 16))
    token = pair.token(ENDPOINT, "https://example.test", 1000.0)
    head, claims, signature = token.split(".")
    raw = base64.urlsafe_b64decode(signature + "=" * (-len(signature) % 4))
    expect_value(bool(P256.is_signed(pair.public, f'{head}.{claims}'.encode(), raw)), True)
    expect_value(bool(P256.is_signed(pair.public, f'{head}.{claims}x'.encode(), raw)), False)
