import inspect

from controllers.base import PRESSED, UNCHANGED_SINCE, Arguments, Pressed
from engine import bus
from resources.base import Refused

ORDERED = (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)
NAMED = (inspect.Parameter.POSITIONAL_OR_KEYWORD, inspect.Parameter.KEYWORD_ONLY)


def spread(fn, positional: tuple, named: dict, extra: dict) -> tuple[list, dict]:
    params = list(inspect.signature(fn).parameters.values())
    names = {p.name for p in params if p.kind in NAMED}
    moved = {key: value for key, value in extra.items() if key in names and named.get(key) is None}
    keyed = {**named, **moved}
    ordered = list(positional)
    rest = next((i for i, p in enumerate(params) if p.kind is inspect.Parameter.VAR_POSITIONAL), None)
    if rest is not None and isinstance(keyed.get(params[rest].name), (list, tuple)):
        ordered.extend(keyed.pop(p.name) for p in params[:rest] if p.kind in ORDERED and p.name in keyed)
        ordered.extend(keyed.pop(params[rest].name))
    return ordered, {**keyed, **{key: value for key, value in extra.items() if key not in moved}}


def passed(call: inspect.BoundArguments) -> dict:
    """Every argument a call names, with the keyword arguments it gathers spread out beside the rest."""
    gathered = next((p.name for p in call.signature.parameters.values() if p.kind is inspect.Parameter.VAR_KEYWORD), "")
    return {**{name: value for name, value in call.arguments.items() if name != gathered}, **call.arguments.get(gathered, {})}


def without_press(given: dict) -> dict:
    return {key: value for key, value in given.items() if key != UNCHANGED_SINCE}


def takes_row(fn) -> bool:
    return next(iter(inspect.signature(fn).parameters), "") == "n"


def invoked(controller, word: str, positional: tuple = (), named: dict | None = None, extra: dict | None = None):
    fn = controller.method(word)
    given = {**(extra or {}), **(named or {})}
    named, extra = without_press(named or {}), without_press(extra or {})
    ordered, keyed = spread(fn, positional, named, extra)
    try:
        call = inspect.signature(fn).bind(*ordered, **keyed)
    except TypeError as error:
        raise Refused(f"{controller.type} {word}: {error}") from error
    controller._refuse_journal_fields(word, Arguments.given(passed(call), {}))
    pressed = PRESSED.set(Pressed.of(controller.type, call.arguments.get("n"), given))
    try:
        with bus.unit():
            return fn(*call.args, **call.kwargs)
    finally:
        PRESSED.reset(pressed)
