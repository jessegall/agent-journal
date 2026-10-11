from dataclasses import dataclass, replace

from controllers.types import CONTROLLERS
from resources.base import Refused, SYSTEM
from resources.fields import Loaded

MOST = 5
LABEL = 120


def runs(record, type_: str, action: str) -> bool:
    if type_ not in CONTROLLERS:
        return False
    try:
        return callable(CONTROLLERS[type_](record, actor=SYSTEM).action(action))
    except (AttributeError, Refused):
        return False


def argv(given) -> tuple[str, ...]:
    """A command as its own words, never as one string to be split by a shell: the words the agent named are the words that run."""
    return tuple(str(word) for word in given if str(word)) if isinstance(given, (list, tuple)) else ()


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
    runs: tuple[str, ...] = ()
    """A command the agent asks the user to run, as its argv. It is shown on the card in full, never shortened, because pressing the button is the user reading it and saying yes."""

    choice: str = ""
    ask: str = ""
    outcome: str = ""

    @classmethod
    def from_payload(cls, given: dict) -> "Button":
        button = cls.from_json(given)
        return replace(button, label=button.label.strip()[:LABEL], n=whole(button.n), runs=argv(button.runs))

    @property
    def command(self) -> str:
        """The command as the user reads it on the card: whole, so what they approve is what runs."""
        return " ".join(self.runs)

    def to_json(self) -> dict:
        kept = {"label": self.label, "type": self.type, "action": self.action, "n": self.n, "body": self.body, "again": self.again,
                "say": self.say, "runs": list(self.runs), "choice": self.choice.strip(), "ask": self.ask.strip(), "outcome": self.outcome.strip()}
        return {key: value for key, value in kept.items() if value not in (None, False, "", [])}


def spent(button: Button, buttons: list[Button], pressed: list[str]) -> bool:
    chosen = {one.choice for one in buttons if one.choice and one.label in pressed}
    return (not button.again and button.label in pressed) or bool(button.choice and button.choice in chosen)


def one(record, given) -> dict:
    if not isinstance(given, dict):
        return {}
    button = Button.from_payload(given)
    if button.label and button.runs:
        return Button(label=button.label, runs=button.runs, again=button.again, choice=button.choice, ask=button.ask, outcome=button.outcome).to_json()
    if button.label and button.say.strip():
        return Button(label=button.label, say=button.say.strip(), again=button.again, choice=button.choice, ask=button.ask).to_json()
    if not button.label or not button.action or not runs(record, button.type, button.action):
        return {}
    return button.to_json()


def shaped(record, given) -> list[dict]:
    if not isinstance(given, list):
        return []
    return [kept for kept in (one(record, b) for b in given[:MOST]) if kept]
