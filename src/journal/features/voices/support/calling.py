from enum import StrEnum


class Calling(StrEnum):
    """How a voice addresses the user."""

    FULL_ADDRESS_FORM = "title and name"
    NAME = "name"
    NONE = "none"
    AGENT_CHOICE = "its own words"

    def called(self, title: str, name: str, own: str | None = None) -> str:
        parts = {Calling.FULL_ADDRESS_FORM: (title, name), Calling.NAME: (name,), Calling.NONE: (), Calling.AGENT_CHOICE: (own,)}[self]
        return " ".join(part for part in parts if part)

    def instruction(self, called: str) -> str:
        if self is Calling.NONE:
            return "Never address me by name or title."
        return f'Address me as "{called}".' if called else ""
