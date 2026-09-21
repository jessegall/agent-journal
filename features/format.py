FORMATTERS: list = []


def formatted(text: str, record=None, surface: str = "") -> str:
    text = str(text or "")
    for fn, where in FORMATTERS:
        if where and surface not in where:
            continue
        try:
            text = str(fn(text, record) or text)
        except Exception:
            continue
    return text
