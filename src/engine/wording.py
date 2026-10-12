import re
from declaring.extension import Extension
from resources.text import noun, plural

PLACEHOLDER = re.compile(r"\{([a-z][a-z0-9_.]*)\}")


APPENDS = Extension()


def appended(on: str, values: dict, line: str) -> str:
    return " - ".join([line, *(added for added in (append(**values) for append in APPENDS.each(key=on)) if added)])


def counted(announced: dict[tuple, dict], record) -> list[str]:
    return [appended(f"{type_}.{action}", {"numbers": list(ns), "record": record}, f"{plural(len(ns), f'new {type_}')} {', '.join(map(str, ns))}" if action == "created"
                    else f"{noun(len(ns), type_)} {', '.join(map(str, ns))} {action}")
            for (type_, action), ns in announced.items() if ns]


def fill(value, values: dict):
    if isinstance(value, list):
        return [fill(part, values) for part in value]
    if isinstance(value, dict):
        return {key: fill(part, values) for key, part in value.items()}
    return PLACEHOLDER.sub(lambda m: str(values.get(m.group(1), m.group(0))), value)
