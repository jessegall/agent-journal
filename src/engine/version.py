from functools import cache

from engine.package import data

FILE = data("VERSION") if data("VERSION").is_file() else data().parent / "VERSION"


@cache
def version() -> str:
    try:
        return FILE.read_text().strip()
    except OSError:
        return ""
