from engine.package import data

FILE = data("VERSION")


def version() -> str:
    try:
        return FILE.read_text().strip()
    except OSError:
        return ""
