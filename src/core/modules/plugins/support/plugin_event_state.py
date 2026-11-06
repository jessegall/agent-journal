from enum import StrEnum


class PluginEventState(StrEnum):
    """How one entry of what a plugin listens to stands, worked out each time it is read."""

    LISTENS = "listens"
    WRONG_KEY = "wrong key"
    RENAMED = "renamed"
    FORM_NOT_OFFERED = "form not offered"
    WRONG_SCRIPT = "wrong script"
    WRONG_PROJECT_READ = "wrong project read"
    NEEDS_NEWER_JOURNAL = "needs a newer journal"
