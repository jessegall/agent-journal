import re

SLUG = re.compile(r"[^a-z0-9]+")


def noun(n: int, word: str) -> str:
    return f"{word}{'s' if n != 1 else ''}"


def plural(n: int, word: str) -> str:
    return f"{n} {noun(n, word)}"


def clipped(text: str, limit: int) -> str:
    return text if len(text) <= limit else text[:limit - 1].rstrip() + "…"


def slugged(name: str, sep: str = "-", limit: int = 0) -> str:
    slug = SLUG.sub(sep, name.lower()).strip(sep)
    return slug[:limit].strip(sep) if limit else slug


APPENDS: dict[str, list] = {}


def appended(on: str, values: dict, line: str) -> str:
    return " - ".join([line, *(added for added in (append(**values) for append in APPENDS.get(on, [])) if added)])


def counted(groups: dict[tuple, dict], record) -> list[str]:
    return [appended(f"{type_}.{action}", {"numbers": list(ns), "record": record}, f"{plural(len(ns), f'new {type_}')} {', '.join(map(str, ns))}" if action == "created"
                    else f"{noun(len(ns), type_)} {', '.join(map(str, ns))} {action}")
            for (type_, action), ns in groups.items()]
