import hashlib
import hmac
import json
import time
from dataclasses import dataclass

from engine.fields import Loaded
from resources.base import Refused

SIGNATURE = "Linear-Signature"
BODY_LIMIT = 256 * 1024
WITHIN = 60.0
REMEMBERED = 600.0


@dataclass(frozen=True)
class Subject(Loaded):
    id: str = ""


@dataclass(frozen=True)
class Event(Loaded):
    """A Linear webhook delivery: only a hint that an issue changed, never the issue itself."""

    aliases = {"stamp": ("webhookTimestamp",), "kind": ("type",)}
    kind: str = ""
    action: str = ""
    stamp: float = 0.0
    data: Subject = Subject()


def signed(secret: str, body: bytes) -> str:
    return hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()


def event_of(body: bytes, signature: str, secret: str, now: float) -> Event:
    """The event a delivery carries, refused unless it is signed with the secret, is not older than a minute, and fits the cap."""
    if not secret:
        raise Refused("no signing secret is picked, so no event is taken")
    if len(body) > BODY_LIMIT:
        raise Refused("the event is too large")
    if not signature or not hmac.compare_digest(signed(secret, body), signature):
        raise Refused("the event is not signed with the signing secret")
    try:
        event = Event.from_json(json.loads(body))
    except ValueError as error:
        raise Refused("the event is not JSON") from error
    if abs(now - event.stamp / 1000) > WITHIN:
        raise Refused("the event is too old")
    return event


class Deliveries:
    """The signatures taken in the last minutes, so the same signed event sent again changes nothing."""

    def __init__(self):
        self.seen: dict[str, float] = {}

    def fresh(self, signature: str, now: float) -> bool:
        self.seen = {one: at for one, at in self.seen.items() if now - at < REMEMBERED}
        if signature in self.seen:
            return False
        self.seen[signature] = now
        return True
