def version_key(version: str) -> tuple:
    return tuple(int(part) if part.isdigit() else 0 for part in str(version).split("."))


def newer(version: str, than: str) -> bool:
    return bool(version) and (not than or than == "0" or version_key(version) > version_key(than))


def shared_parts(version: str, other: str, parts: int) -> bool:
    return version_key(version)[:parts] == version_key(other)[:parts]


def line_of(version: str) -> int:
    """The major line a version belongs to, which an install keeps receiving patches on until it is moved to another by name."""
    return version_key(version)[0]
