from enum import StrEnum


class PluginFilePlace(StrEnum):
    """Where journal plugin file reads a name: the checkout of the agent, the project, or the base commit."""

    CHECKOUT = "checkout"
    PROJECT = "project"
    BASE = "base"
