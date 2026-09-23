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


@dataclass(frozen=True)
class Button(Loaded):
    aliases = {"action": ("action", "method")}
    label: str = ""
    type: str = ""
    action: str = ""
    n: int | None = None
    body: dict | None = None
    again: bool = False

    @classmethod
    def from_payload(cls, given: dict) -> "Button":
        try:
            n = int(given["n"])
        except (KeyError, TypeError, ValueError):
            n = None
        button = cls.from_json({key: value for key, value in given.items() if key != "n"})
        return replace(button, label=button.label.strip()[:LABEL], n=n)

    def to_json(self) -> dict:
        kept = {"label": self.label, "type": self.type, "action": self.action, "n": self.n, "body": self.body, "again": self.again}
        return {key: value for key, value in kept.items() if value is not None and value is not False}


def one(record, given) -> dict:
    if not isinstance(given, dict):
        return {}
    button = Button.from_payload(given)
    if not button.label or not button.action or not runs(record, button.type, button.action):
        return {}
    return button.to_json()


def shaped(record, given) -> list[dict]:
    if not isinstance(given, list):
        return []
    return [kept for kept in (one(record, b) for b in given[:MOST]) if kept]
