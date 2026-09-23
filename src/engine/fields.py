def text_of(raw: dict, *keys: str) -> str:
    for key in keys:
        value = raw.get(key)
        if value is None or value == "":
            continue
        return value if isinstance(value, str) else str(value)
    return ""


def number_of(raw: dict, *keys: str) -> float:
    for key in keys:
        value = raw.get(key)
        if value is None or value == "":
            continue
        return float(value)
    return 0.0


def whole_of(raw: dict, *keys: str) -> int:
    return int(number_of(raw, *keys))


def flag_of(raw: dict, key: str) -> bool:
    return bool(raw.get(key))


def mapping_of(raw: dict, key: str) -> dict:
    value = raw.get(key)
    return value if isinstance(value, dict) else {}


def list_of(raw: dict, key: str) -> list:
    value = raw.get(key)
    return value if isinstance(value, list) else []
