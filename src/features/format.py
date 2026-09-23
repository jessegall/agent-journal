from engine.watch import threw
from resources.base import SECTION

FORMATTERS: list = []
DOWNLOAD = "download"
VIEWER = "viewer"


def formatted(text: str, record=None, surface: str = "") -> str:
    text = "" if text is None else str(text)
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
