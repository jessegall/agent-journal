FORMATTERS: list = []


def formatted(text: str, record=None) -> str:
    said = str(text or "")
    for fn in FORMATTERS:
        try:
            said = str(fn(said, record) or said)
        except Exception:
            continue
    return said
