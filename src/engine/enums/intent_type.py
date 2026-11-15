from enum import StrEnum


class IntentType(StrEnum):
    """External work a step asks for after its commit, done by its owner."""

    TYPING = "typing"
    RESUME = "resume"
    PROCESS_START = "process-start"
    PLUGIN_DELIVERY = "plugin-delivery"
