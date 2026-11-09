from enum import StrEnum


class CreatorType(StrEnum):
    """Who made a task: a person, the main agent, a helper of any kind, or the journal itself."""

    PERSON = "person"
    MAIN_AGENT = "main_agent"
    HELPER = "helper"
    JOURNAL = "journal"
