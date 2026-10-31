from enum import StrEnum


class HookTrust(StrEnum):
    """Whether the program runs the journal's hooks in a folder: not written, written but not trusted, trusted before
    the file changed, or ready."""

    UNWRITTEN = "unwritten"
    UNTRUSTED = "untrusted"
    CHANGED = "changed"
    READY = "ready"
