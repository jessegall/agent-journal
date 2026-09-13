from __future__ import annotations

import re

_OPTIONAL = re.compile(r"\[([^\[\]]*)\]")
_FIELD = re.compile(r"\{(\w+)(?::([^{}]*))?\}")
_ESCAPES = (("\\[", "\x00"), ("\\]", "\x01"), ("{{", "\x02"), ("}}", "\x03"))


def _empty(value) -> bool:
    return value is None or value is False or value == "" or (isinstance(value, (list, tuple)) and not value)


def _text(value, sep: str | None) -> str:
    if isinstance(value, (list, tuple)):
        return (", " if sep is None else sep).join(str(v) for v in value)
    return "" if value is None else str(value)


def render(template: str, **values) -> str:
    """`{name}` fills a value, `{name:sep}` joins a list, `[... {name} ...]` is dropped when a
    placeholder inside it is empty. `\\[`, `\\]`, `{{` and `}}` are literal."""
    for raw, mark in _ESCAPES:
        template = template.replace(raw, mark)

    def field(m: re.Match) -> str:
        if m.group(1) not in values:
            raise KeyError(f"template placeholder {m.group(1)!r} has no value: {template!r}")
        return _text(values[m.group(1)], m.group(2))

    def optional(m: re.Match) -> str:
        inner = m.group(1)
        names = [f.group(1) for f in _FIELD.finditer(inner)]
        return "" if any(n in values and _empty(values[n]) for n in names) else inner

    text = _FIELD.sub(field, _OPTIONAL.sub(optional, template))
    for raw, mark in _ESCAPES:
        text = text.replace(mark, raw[1] if raw.startswith("\\") else raw[0])
    return text
