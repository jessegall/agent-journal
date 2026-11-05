from enum import StrEnum


class ServiceRestart(StrEnum):
    """When a plugin's service that ended is started again: always, only when it failed, or never."""

    ANY_END = "always"
    FAILED_END = "on-failure"
    STOPPED_END = "never"
