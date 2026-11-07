from enum import StrEnum


class FileStatus(StrEnum):
    """What happened to a file in a checkout, against the commit that checkout started from."""

    CHANGED = "changed"
    ADDED = "added"
    DELETED = "deleted"
    RENAMED = "renamed"
