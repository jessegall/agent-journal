from enum import StrEnum


class Responder(StrEnum):
    """Who an escalation asks: the agent's parent, or a person."""

    PARENT = "parent"
    PERSON = "person"
