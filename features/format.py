FORMATTERS: list = []


def formatted(text: str, record=None, surface: str = "") -> str:
    said = str(text or "")
    for fn, where in FORMATTERS:
        if where and surface not in where:
            continue
        try:
            said = str(fn(said, record) or said)
        except Exception:
            continue
    return said
