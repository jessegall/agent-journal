from controllers.faults import threw
from engine.markers import plain
from features.switches import generation
from resources.base import SECTION, as_dict
from engine.extension import Extension
from engine.memo import Memo

FORMATTERS = Extension()
DOWNLOAD = "download"
VIEWER = "viewer"
SHARED = "shared"
TEXT_FIELDS = ("title", "abstract", "brief", "outcome")
PLAIN_FIELDS = ("title", "abstract")
CATALOGUES: dict = {}
KEEP_CATALOGUES = 8
KEEP_SHAPED = 5000
SHAPED = Memo(KEEP_SHAPED)


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


def shaped(r, record=None, surface: str = "") -> dict:
    key = (str(record.home), r.type, r.n, r.updated, surface, settled(record)) if record is not None and hasattr(r, "updated") else None
    if key is None:
        return shape(r, record, surface)
    return SHAPED.get(key, None, lambda: shape(r, record, surface))


def shape(r, record=None, surface: str = "") -> dict:
    row = as_dict(r)
    fields = {key: formatted(row.get(key), record, surface) for key in TEXT_FIELDS if row.get(key)}
    fields = {**fields, **{key: plain(fields[key]) for key in PLAIN_FIELDS if key in fields}}
    parts = [{**s, SECTION.title: formatted(s.get(SECTION.title), record, surface), SECTION.body: formatted(s.get(SECTION.body), record, surface)}
             for s in row.get("sections") or []]
    data = {key: [{**item, **{sub: formatted(item.get(sub), record, surface) for sub in subs if item.get(sub)}} for item in row["data"].get(key) or []]
            for key, subs in getattr(r, "formatted_data", {}).items() if row.get("data", {}).get(key)}
    shaped_row = {**row, **fields}
    if parts:
        shaped_row["sections"] = parts
    if data:
        shaped_row["data"] = {**row["data"], **data}
    return shaped_row


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
