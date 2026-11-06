from enum import StrEnum


class PluginMarkVariant(StrEnum):
    """What a plugin health mark says: the plugin keeps failing, it answers again, or it listens to a key this journal
    no longer has."""

    FAILING = "failing"
    HEALTHY = "healthy"
    WRONG_KEY = "wrong-key"
