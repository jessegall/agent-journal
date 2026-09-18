from __future__ import annotations

from datetime import datetime, timezone

from templates import render

MESSAGES = {
    "number": "{name} wants a number, got {value}",
    "list": "{name} wants a list, got {value}",
    "object": "{name} wants an object, got {value}",
}


def say(message: str, /, **values) -> str:
    return render(MESSAGES[message], **values)


class PayloadError(ValueError):
    pass


_TRUE = ("1", "true", "yes", "on")
_EMPTY = {str: "", bool: False, list: [], dict: {}}


class Field:
    __slots__ = ("kind", "default", "key", "verbatim")

    def __init__(self, kind: type, default=None, *, key: str = "", verbatim: bool = False):
        self.kind, self.key, self.verbatim = kind, key, verbatim
        self.default = _EMPTY[kind] if default is None and kind in _EMPTY else default

    def fresh(self):
        return type(self.default)(self.default) if isinstance(self.default, (list, dict)) else self.default

    def coerce(self, name: str, value):
        if self.kind is str:
            return str(value) if self.verbatim else " ".join(str(value).split())
        if self.kind is bool:
            return value.strip().lower() in _TRUE if isinstance(value, str) else bool(value)
        if self.kind in (int, float):
            try:
                return self.kind(value)
            except (TypeError, ValueError):
                raise PayloadError(say("number", name=name, value=repr(value))) from None
        if self.kind is list:
            if isinstance(value, str):
                return [value]
            if not isinstance(value, (list, tuple)):
                raise PayloadError(say("list", name=name, value=repr(value)))
            return [str(v) for v in value]
        if self.kind is dict:
            if not isinstance(value, dict):
                raise PayloadError(say("object", name=name, value=repr(value)))
            return dict(value)
        return value


class Payload:
    schema: dict[str, Field] = {}

    def __init_subclass__(cls, **kw):
        super().__init_subclass__(**kw)
        cls.schema = {**cls.schema, **{k: v for k, v in vars(cls).items() if isinstance(v, Field)}}

    def __init__(self, env: str = "", id=None, source: str = "cli", at: str = "", given=(), **values):
        self.env, self.id, self.source = env, id, source
        self.at = at or datetime.now(timezone.utc).isoformat(timespec="seconds")
        self.given = frozenset(given)
        for name, f in self.schema.items():
            setattr(self, name, values[name] if name in values else f.fresh())

    def has(self, name: str) -> bool:
        return name in self.given

    @classmethod
    def build(cls, env: str, id, sent: dict, source: str) -> Payload:
        values = {}
        for name, f in cls.schema.items():
            value = sent.get(f.key or name)
            if value is None and not f.key:
                value = sent.get(name.replace("_", "-"))
            if value is not None:
                values[name] = f.coerce(name, value)
        return cls(env, id, source, given=values, **values)
