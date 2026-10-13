from install import version_key


def newer(version: str, than: str) -> bool:
    return bool(version) and (not than or than == "0" or version_key(version) > version_key(than))


def shared_parts(version: str, other: str, parts: int) -> bool:
    return version_key(version)[:parts] == version_key(other)[:parts]
