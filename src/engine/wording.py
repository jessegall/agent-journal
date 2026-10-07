import hashlib
import re
from engine.extension import Extension

SLUG = re.compile(r"[^a-z0-9]+")
PLACEHOLDER = re.compile(r"\{([a-z][a-z0-9_.]*)\}")


def noun(n: int, word: str) -> str:
    return f"{word}{'s' if n != 1 else ''}"


def plural(n: int, word: str) -> str:
    return f"{n} {noun(n, word)}"


def digest(text: str | bytes, length: int = 40) -> str:
    return hashlib.sha1(text if isinstance(text, bytes) else text.encode()).hexdigest()[:length]


def clipped(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def slugged(name: str, sep: str = "-", limit: int = 0) -> str:
    slug = SLUG.sub(sep, name.lower()).strip(sep)
    return slug[:limit].strip(sep) if limit else slug


APPENDS = Extension()


def appended(on: str, values: dict, line: str) -> str:
    return " - ".join([line, *(added for added in (append(**values) for append in APPENDS.each(key=on)) if added)])


def counted(groups: dict[tuple, dict], record) -> list[str]:
    return [appended(f"{type_}.{action}", {"numbers": list(ns), "record": record}, f"{plural(len(ns), f'new {type_}')} {', '.join(map(str, ns))}" if action == "created"
                    else f"{noun(len(ns), type_)} {', '.join(map(str, ns))} {action}")
            for (type_, action), ns in groups.items()]


def fill(value, values: dict):
    if isinstance(value, list):
        return [fill(part, values) for part in value]
    if isinstance(value, dict):
        return {key: fill(part, values) for key, part in value.items()}
    return PLACEHOLDER.sub(lambda m: str(values.get(m.group(1), m.group(0))), value)
