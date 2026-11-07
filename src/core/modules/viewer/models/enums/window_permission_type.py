from enum import StrEnum


class WindowPermissionType(StrEnum):
    """What a window permission allows: the read lines or the commands a window declares, or a module's
    component windows run in the viewer's page."""

    READS = "reads"
    RUNS = "runs"
    COMPONENT = "component"
