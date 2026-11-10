from enum import StrEnum


class AddressForm(StrEnum):
    """How a voice addresses the user: by title and name, by name, not at all, or in words of its own."""

    TITLE_NAME = "title and name"
    NAME = "name"
    NONE = "none"
    CUSTOM = "its own words"

    def called(self, title: str, name: str, custom: str | None = None) -> str:
        parts = {AddressForm.TITLE_NAME: [title, name], AddressForm.NAME: [name], AddressForm.NONE: [], AddressForm.CUSTOM: [custom]}[self]
        return " ".join(part for part in parts if part)

    def instruction(self, called: str) -> str:
        if self is AddressForm.NONE:
            return "Never address me by name or title."
        return f'Address me as "{called}".' if called else ""
