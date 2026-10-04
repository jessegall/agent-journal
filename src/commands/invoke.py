import inspect

from engine import bus
from engine.stored import undoable
from resources.base import Refused

ORDERED = (inspect.Parameter.POSITIONAL_ONLY, inspect.Parameter.POSITIONAL_OR_KEYWORD)
NAMED = (inspect.Parameter.POSITIONAL_OR_KEYWORD, inspect.Parameter.KEYWORD_ONLY)


def spread(fn, positional: list, named: dict, extra: dict) -> tuple[list, dict]:
    params = list(inspect.signature(fn).parameters.values())
    names = {p.name for p in params if p.kind in NAMED}
    for key in [key for key in extra if key in names and named.get(key) is None]:
        named[key] = extra.pop(key)
    rest = next((i for i, p in enumerate(params) if p.kind is inspect.Parameter.VAR_POSITIONAL), None)
    if rest is not None:
        positional.extend(named.pop(p.name) for p in params[:rest] if p.kind in ORDERED and p.name in named)
        positional.extend(named.pop(params[rest].name, None) or ())
    return positional, {**named, **extra}


def invoked(controller, word: str, positional: tuple = (), named: dict | None = None, extra: dict | None = None):
    fn = controller.method(word)
    ordered, keyed = spread(fn, list(positional), dict(named or {}), dict(extra or {}))
    try:
        call = inspect.signature(fn).bind(*ordered, **keyed)
    except TypeError as error:
        raise Refused(f"{controller.type} {word}: {error}") from error
    with bus.settled(), undoable():
        return fn(*call.args, **call.kwargs)
