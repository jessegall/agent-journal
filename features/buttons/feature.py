from controllers.types import CONTROLLERS, Messages
from features.base import Feature, event
from resources.base import Refused, SYSTEM

MOST = 5
LABEL = 40


def runs(record, type_: str, action: str) -> bool:
    if type_ not in CONTROLLERS:
        return False
    try:
        return callable(CONTROLLERS[type_](record, actor=SYSTEM).action(action))
    except (AttributeError, Refused):
        return False


def one(record, given) -> dict:
    if not isinstance(given, dict):
        return {}
    label = str(given.get("label") or "").strip()[:LABEL]
    type_ = str(given.get("type") or "")
    action = str(given.get("action") or given.get("method") or "")
    if not label or not action or not runs(record, type_, action):
        return {}
    kept = {"label": label, "type": type_, "action": action}
    try:
        kept["n"] = int(given["n"])
    except (KeyError, TypeError, ValueError):
        pass
    if isinstance(given.get("body"), dict):
        kept["body"] = given["body"]
    if given.get("again"):
        kept["again"] = True
    return kept


def shaped(record, given) -> list[dict]:
    if not isinstance(given, list):
        return []
    return [kept for kept in (one(record, b) for b in given[:MOST]) if kept]


class Buttons(Feature):
    name = "buttons"
    title_ = "Buttons on a message"
    abstract_ = "A message the agent writes can carry buttons, each running one journal command when the user presses it"
    help_ = "journal message create \"Ready when you are\" --set buttons='[{\"label\": \"Okay, start\", \"type\": \"plan\", \"n\": 3, \"action\": \"activate\"}]'. A button runs that one command and nothing else; a button naming a type or an action that does not exist is dropped when the message is written. A button goes once it is pressed, and the message says which one; \"again\": true keeps it there to be pressed as often as the user likes."

    @event("message.created")
    @event("message.updated")
    def check(self, event, record) -> None:
        rows = Messages(record, actor=SYSTEM)
        given = (rows.load(event.n).data or {}).get("buttons")
        if given is None:
            return
        kept = shaped(record, given)
        if kept != given:
            rows.update(event.n, buttons=kept)
