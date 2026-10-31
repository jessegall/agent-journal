from enum import StrEnum


class PluginMarkVariant(StrEnum):
    """What a plugin health mark says: the plugin keeps failing, or it answers again."""

    FAILING = "failing"
    HEALTHY = "healthy"
