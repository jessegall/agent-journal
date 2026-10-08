from controllers.messages import Messages
from controllers.types import CONTROLLERS
from features.message_buttons.shaping import Button, spent
from resources.base import Stale, titled


def pressed_of(row) -> list[str]:
    return list(row.data.get("pressed") or [])


def unspent(row) -> list[Button]:
    buttons = [Button.from_payload(given) for given in row.data.get("buttons") or []]
    pressed = pressed_of(row)
    answered = bool(row.data.get("answered_own"))
    return [button for button in buttons if not spent(button, buttons, pressed) and not (answered and button.choice)]


def press(record, row, label: str, actor: str, via: str):
    button = next((one for one in unspent(row) if one.label == label), None)
    if button is None:
        raise Stale(f"{label!r} is no longer on {row.ref}")
    if button.say:
        Messages(record, actor=actor).create(titled(button.say), brief=button.say, about=row.ref, via=via)
    elif button.n is None:
        CONTROLLERS[button.type](record, actor=actor).action(button.action)(**(button.body or {}))
    else:
        CONTROLLERS[button.type](record, actor=actor).action(button.action)(button.n, **(button.body or {}))
    rows = CONTROLLERS[row.type](record, actor=actor)
    return rows.action("set")(row.n, key="pressed", value=list(dict.fromkeys([*pressed_of(row), button.label])))
