from enum import StrEnum


class OptionScope(StrEnum):
    """Whose a setting is on a shared journal: the whole team's, one machine's, or one person's."""

    TEAM = "team"
    MACHINE = "machine"
    PERSON = "person"
