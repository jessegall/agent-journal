from enum import StrEnum


class PluginMarkVariant(StrEnum):
    """The status shown in a plugin health mark."""

    FAILING = "failing"
    HEALTHY = "healthy"
    WRONG_KEY = "wrong-key"
