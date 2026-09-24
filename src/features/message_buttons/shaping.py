from dataclasses import dataclass, replace

from controllers.types import CONTROLLERS
from resources.base import Refused, SYSTEM
from engine.fields import Loaded

MOST = 5
LABEL = 40


def runs(record, type_: str, action: str) -> bool:
    if type_ not in CONTROLLERS:
        return False
    try:
        return callable(CONTROLLERS[type_](record, actor=SYSTEM).action(action))
    except (AttributeError, Refused):
        return False


def whole(value) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


@dataclass(frozen=True)
class Button(Loaded):
    aliases = {"action": ("action", "method")}
    label: str = ""
    type: str = ""
    action: str = ""
    n: object = None
    body: dict | None = None
    again: bool = False
    say: str = ""

    @classmethod
    def from_payload(cls, given: dict) -> "Button":
        button = cls.from_json(given)
        return replace(button, label=button.label.strip()[:LABEL], n=whole(button.n))

    def to_json(self) -> dict:
        kept = {"label": self.label, "type": self.type, "action": self.action, "n": self.n, "body": self.body, "again": self.again,
                "say": self.say}
        return {key: value for key, value in kept.items() if value not in (None, False, "")}


def one(record, given) -> dict:
    if not isinstance(given, dict):
        return {}
    button = Button.from_payload(given)
    if button.label and button.say.strip():
        return Button(label=button.label, say=button.say.strip(), again=button.again).to_json()
    if not button.label or not button.action or not runs(record, button.type, button.action):
        return {}
    return button.to_json()


def shaped(record, given) -> list[dict]:
    if not isinstance(given, list):
        return []
    return [kept for kept in (one(record, b) for b in given[:MOST]) if kept]
