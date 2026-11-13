from enum import StrEnum


class ProgramSettingsMarkVariant(StrEnum):
    """What a program settings mark tells of."""

    UNREADABLE_PERSON_FILE = "unreadable-person-file"
    PROJECT_HOOKS_WAITING = "held-project-hooks"
    RESTORED = "put-back"
    PROGRAM_SWITCH = "switched"
