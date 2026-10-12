import re
from dataclasses import dataclass
from typing import Callable
from declaring.extension import Extension
from resources.text import noun, plural

PLACEHOLDER = re.compile(r"\{([a-z][a-z0-9_.]*)\}")


APPENDS = Extension()


@dataclass(frozen=True)
class Addition:
    """What a feature adds to an announcement. One that names the rows itself stands instead of the count, which would otherwise say the same thing twice."""
    says: Callable
    instead: bool = False


def appended(on: str, values: dict, line: str) -> str:
    written = [(add.instead, said) for add in APPENDS.each(key=on) if (said := add.says(**values))]
    replacing = next((said for instead, said in written if instead), "")
    return " - ".join([replacing or line, *(said for instead, said in written if not instead)])


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
