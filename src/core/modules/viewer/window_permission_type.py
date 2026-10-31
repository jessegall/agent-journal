from enum import StrEnum


class WindowPermissionType(StrEnum):
    """What a window permission allows: the read lines or the commands a window declares, or a module's code in the
    page."""

    READS = "reads"
    RUNS = "runs"
    PAGE = "page"
