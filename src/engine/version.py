from functools import cache

from engine.package import data

FILE = data("VERSION")


@cache
def version() -> str:
    try:
        return FILE.read_text().strip()
    except OSError:
        return ""
