from enum import StrEnum


class Calling(StrEnum):
    """How a voice addresses the user."""

    TITLE_AND_NAME = "title and name"
    NAME = "name"
    NONE = "none"
    OWN = "its own words"

    def called(self, title: str, name: str, own: str | None = None) -> str:
        parts = {Calling.TITLE_AND_NAME: (title, name), Calling.NAME: (name,), Calling.NONE: (), Calling.OWN: (own,)}[self]
        return " ".join(part for part in parts if part)

    def instruction(self, called: str) -> str:
        if self is Calling.NONE:
            return "Never address me by name or title."
        return f'Address me as "{called}".' if called else ""
