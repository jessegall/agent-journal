from engine.markers import plain
from features.base import generation
from features.format import formatted
from resources.base import as_dict


SAID = ("title", "abstract", "brief", "outcome")
PLAIN_FIELDS = ("title", "abstract")

SHAPED: dict = {}

KEEP_SHAPED = 5000

def settled(record) -> tuple:
    try:
        stamp = (record.home / "settings.json").stat().st_mtime_ns
    except OSError:
        stamp = 0
    return stamp, generation()


def shaped(r, record=None, surface: str = "") -> dict:
    key = (str(record.home), r.type, r.n, r.updated, surface, settled(record)) if record is not None and hasattr(r, "updated") else None
    if key in SHAPED:
        return SHAPED[key]
    out = shaping(r, record, surface)
    if key:
        if len(SHAPED) >= KEEP_SHAPED:
            SHAPED.clear()
        SHAPED[key] = out
    return out


def shaping(r, record=None, surface: str = "") -> dict:
    row = as_dict(r)
    fields = {key: formatted(row.get(key), record, surface) for key in SAID if row.get(key)}
    fields = {**fields, **{key: plain(fields[key]) for key in PLAIN_FIELDS if key in fields}}
    parts = [{**s, "body": formatted(s.get("body"), record, surface)} for s in row.get("sections") or []]
    data = {key: [{**item, **{sub: formatted(item.get(sub), record, surface) for sub in subs if item.get(sub)}} for item in row["data"].get(key) or []]
            for key, subs in getattr(r, "formatted_data", {}).items() if row.get("data", {}).get(key)}
    shaped_row = {**row, **fields}
    if parts:
        shaped_row["sections"] = parts
    if data:
        shaped_row["data"] = {**row["data"], **data}
    return shaped_row
