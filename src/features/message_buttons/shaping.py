from controllers.types import CONTROLLERS
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
