from controllers.faults import threw
from engine.markers import plain
from features.switches import generation
from resources.base import SECTION, TEXT_FIELDS, as_dict
from engine.extension import Extension
from engine.memo import Memo

FORMATTERS = Extension()
DOWNLOAD = "download"
VIEWER = "viewer"
SHARED = "shared"
PLAIN_FIELDS = ("title", "abstract")
CATALOGUES: dict = {}
KEEP_CATALOGUES = 8
KEEP_SHAPED = 5000
KEEP_TEXTS = 20000
WORDED: list[Memo] = []


def worded(limit: int) -> Memo:
    memo = Memo(limit)
    WORDED.append(memo)
    return memo


SHAPED = worded(KEEP_SHAPED)
CARDS = worded(KEEP_SHAPED)
TEXTS = worded(KEEP_TEXTS)


def forget_mentions(words) -> None:
    for memo in WORDED:
        memo.forget_mentioning(words)


def formatted(text: str, record=None, surface: str = "") -> str:
    text = "" if text is None else str(text)
    for fn, where in FORMATTERS.each():
        if where and surface not in where:
            continue
        try:
            text = str(fn(text, record) or text)
        except Exception:
            if record is None:
                raise
            threw(record.root, record.env, f"the formatter {fn.__name__}")
    return text


def settled(record) -> tuple:
    return record.settings_file.held()[0], generation()


def formatted_item(text: str, record, surface: str) -> str:
    if record is None:
        return formatted(text, record, surface)
    return TEXTS.get((str(record.home), surface, text), settled(record), lambda: formatted(text, record, surface))


def shaped(r, record, surface: str = "") -> dict:
    return SHAPED.get((str(record.home), r.type, r.n, r.updated, surface, settled(record)), None, lambda: shape(r, record, surface))


def shape(r, record=None, surface: str = "") -> dict:
    row = as_dict(r)
    fields = {key: formatted(row.get(key), record, surface) for key in TEXT_FIELDS if row.get(key)}
    fields = {**fields, **{key: plain(fields[key]) for key in PLAIN_FIELDS if key in fields}}
    parts = [{**s, SECTION.title: formatted(s.get(SECTION.title), record, surface), SECTION.body: formatted(s.get(SECTION.body), record, surface)}
             for s in row.get("sections") or []]
    data = {key: [{**item, **{sub: formatted_item(item[sub], record, surface) for sub in subs if item.get(sub)}} for item in row["data"].get(key) or []]
            for key, subs in getattr(r, "formatted_data", {}).items() if row.get("data", {}).get(key)}
    shaped_row = {**row, **fields}
    if parts:
        shaped_row["sections"] = parts
    if data:
        shaped_row["data"] = {**row["data"], **data}
    return shaped_row


def carded(r, record, surface: str = "") -> dict:
    return CARDS.get((str(record.home), r.type, r.n, r.updated, surface, settled(record)), None, lambda: card(r, record, surface))


def card(r, record=None, surface: str = "") -> dict:
    """What a result card shows, formatted: the title, the abstract or else the brief, and the section titles; no other text."""
    row = as_dict(r)
    shown = ("title", "abstract" if row.get("abstract") else "brief")
    fields = {key: formatted(row.get(key), record, surface) for key in shown if row.get(key)}
    fields = {**fields, **{key: plain(fields[key]) for key in PLAIN_FIELDS if key in fields}}
    parts = [{SECTION.title: formatted(s.get(SECTION.title), record, surface)} for s in row.get("sections") or []]
    data = {key: value for key, value in (row.get("data") or {}).items() if key not in getattr(r, "formatted_data", {})}
    return {**{key: value for key, value in row.items() if key not in TEXT_FIELDS}, **fields, "sections": parts, "data": data}


def markdown(row, record=None) -> str:
    shaped_row = shape(row, record, DOWNLOAD)
    parts = [f"# {shaped_row['title']}"]
    parts += [f"_{shaped_row['abstract']}_"] if row.abstract else []
    parts += [shaped_row["brief"]] if row.brief else []
    parts += [f"## {s[SECTION.title]}\n\n{s[SECTION.body]}" for s in shaped_row.get("sections", [])]
    return "\n\n".join(part.strip() for part in parts) + "\n"


def catalogue(described: dict, record) -> dict:
    key = (str(record.home), settled(record))
    if key in CATALOGUES:
        return CATALOGUES[key]
    if len(CATALOGUES) >= KEEP_CATALOGUES:
        CATALOGUES.clear()
    CATALOGUES[key] = {name: {**feature, "help": formatted(feature["help"], record, VIEWER)} for name, feature in described.items()}
    return CATALOGUES[key]


def rendered(got, record):
    if hasattr(got, "ref"):
        return shaped(got, record)
    if isinstance(got, list):
        return [rendered(item, record) for item in got]
    if isinstance(got, dict):
        return {key: rendered(value, record) for key, value in got.items()}
    return got
