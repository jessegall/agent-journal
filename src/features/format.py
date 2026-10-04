import time

from controllers.faults import threw
from resources.base import SECTION

FORMATTERS: list = []
FORMATTED: dict[tuple, tuple[float, str]] = {}
FORMATTED_FOR = 60.0
FORMATTED_KEPT = 20000
DOWNLOAD = "download"
VIEWER = "viewer"
SHARED = "shared"


def formatted(text: str, record=None, surface: str = "") -> str:
    from features.shaping import settled
    text = "" if text is None else str(text)
    key, now = (text, str(record.home) if record is not None else "", surface,
                settled(record) if record is not None else ()), time.monotonic()
    held = FORMATTED.get(key)
    if held is not None and now - held[0] < FORMATTED_FOR:
        return held[1]
    if len(FORMATTED) >= FORMATTED_KEPT:
        for entry in [entry for entry, held in FORMATTED.items() if now - held[0] >= FORMATTED_FOR]:
            FORMATTED.pop(entry)
        if len(FORMATTED) >= FORMATTED_KEPT:
            FORMATTED.pop(next(iter(FORMATTED)))
    FORMATTED[key] = (now, shaped := shaping(text, record, surface))
    return shaped


def shaping(text: str, record, surface: str) -> str:
    for fn, where in FORMATTERS:
        if where and surface not in where:
            continue
        try:
            text = str(fn(text, record) or text)
        except Exception:
            if record is None:
                raise
            threw(record.root, record.env, f"the formatter {fn.__name__}")
    return text


def markdown(row, record=None) -> str:
    parts = [f"# {formatted(row.title, record, DOWNLOAD)}"]
    parts += [f"_{formatted(row.abstract, record, DOWNLOAD)}_"] if row.abstract else []
    parts += [formatted(row.brief, record, DOWNLOAD)] if row.brief else []
    parts += [f"## {formatted(s[SECTION.title], record, DOWNLOAD)}\n\n{formatted(s[SECTION.body], record, DOWNLOAD)}" for s in row.sections]
    return "\n\n".join(part.strip() for part in parts) + "\n"
