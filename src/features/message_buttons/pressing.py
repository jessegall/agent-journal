from controllers.types import CONTROLLERS, Messages, Nudges
from resources.buttons import Button, pressed_of, unspent
from resources.base import Stale, SYSTEM, titled
from serving import SERVED, Processes

LONGEST = 120.0
MOST_SAID = 2000


def press(record, row, label: str, actor: str, via: str):
    button = next((one for one in unspent(row) if one.label == label), None)
    if button is None:
        raise Stale(f"{label!r} is no longer on {row.ref}")
    if button.runs:
        runs(record, row, button)
    elif button.say:
        Messages(record, actor=actor).create(titled(button.say), brief=button.say, about=row.ref, via=via)
    elif button.n is None:
        CONTROLLERS[button.type](record, actor=actor).action(button.action)(**(button.body or {}))
    else:
        CONTROLLERS[button.type](record, actor=actor).action(button.action)(button.n, **(button.body or {}))
    rows = CONTROLLERS[row.type](record, actor=actor)
    return rows.action("set")(row.n, key="pressed", value=list(dict.fromkeys([*pressed_of(row), button.label])))


def runs(record, row, button: Button) -> None:
    """Runs the command the agent asked for, now that the user has read it and said yes. It runs beside the press, so the user is not held while it works, and the agent is told what it said either way."""
    SERVED.given(Processes).ran_behind(f"button {row.ref} {button.label}", list(button.runs), record.root.parent, LONGEST, lambda done: told(record, row, button, done))


def told(record, row, button: Button, done) -> None:
    """Tells the agent what the command said. A command that could not run at all is said as that, rather than as an empty answer."""
    Nudges(record, actor=SYSTEM).create(titled(f"{button.label}: {said(done)}"), brief=f"{button.command}\n\n{said(done)}", private=True)


def said(done) -> str:
    if done is None:
        return f"it could not be run at all, so nothing happened"
    spoke = (done.stdout or "").strip() or (done.stderr or "").strip()
    return f"it ended {done.returncode}" + (f": {spoke[:MOST_SAID]}" if spoke else ", saying nothing")
