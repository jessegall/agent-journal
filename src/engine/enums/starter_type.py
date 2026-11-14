from enum import StrEnum


class StarterType(StrEnum):
    """Who started an execution: the main agent, a helper, the person, a plugin or the journal itself."""

    MAIN_AGENT = "main agent"
    HELPER = "helper"
    PERSON = "the person"
    PLUGIN = "plugin"
    JOURNAL = "the journal"
