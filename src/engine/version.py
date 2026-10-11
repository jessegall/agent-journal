import zipfile
from functools import cache

from engine.package import CODE, ZIPPED, data

NAME = "VERSION"
FILE = data(NAME) if data(NAME).is_file() else data().parent / NAME


@cache
def version() -> str:
    """The version of the code this process runs: a build carries its own, so a process left on an older build never reports the installed one."""
    if ZIPPED:
        with zipfile.ZipFile(CODE) as build:
            if NAME in build.namelist():
                return build.read(NAME).decode().strip()
    try:
        return FILE.read_text().strip()
    except OSError:
        return ""
