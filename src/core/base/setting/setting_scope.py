from enum import StrEnum


class SettingScope(StrEnum):
    """Where a setting's value may be set: for the whole project, for one environment, or both."""

    PROJECT = "project"
    ENVIRONMENT = "environment"
    BOTH = "both"
