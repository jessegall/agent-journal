from enum import StrEnum


class RunScope(StrEnum):
    """Over what a plugin's kind of run counts its runs at once: this project, or every project on the machine."""

    PROJECT = "project"
    MACHINE = "machine"
