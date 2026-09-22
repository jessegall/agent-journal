import re
from functools import cache

from engine.markers import MARKER, marked
from features.format import VIEWER
from features.parts import Context, TextFormatter
from resources.types import TYPES

KEPT = re.compile(r"`[^`]*`|" + MARKER.pattern)


@cache
def named() -> tuple[dict[str, str], re.Pattern]:
    names = {spelling: name for name, type_ in TYPES.items() for spelling in (name, type_.details.title.lower()) if spelling}
    return names, re.compile(r"\b(" + "|".join(sorted(map(re.escape, names), key=len, reverse=True)) + r")s?\s+#?(\d+)\b", re.IGNORECASE)


def chipped(text: str) -> str:
    names, found = named()
    return found.sub(lambda m: marked("chip", f"{names[m.group(1).lower()]}:{m.group(2)}", m.group(0)), text)


class MarkRows(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        parts, at = [], 0
        for kept in KEPT.finditer(text):
            parts += [chipped(text[at:kept.start()]), kept.group(0)]
            at = kept.end()
        return "".join([*parts, chipped(text[at:])])
