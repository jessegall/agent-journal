from enum import StrEnum


class AddressForm(StrEnum):
    """How a voice addresses the user."""

    FULL_ADDRESS_FORM = "title and name"
    NAME = "name"
    NONE = "none"
    AGENT_CHOICE = "its own words"

    def called(self, title: str, name: str, owned: str | None = None) -> str:
        parts = {AddressForm.FULL_ADDRESS_FORM: (title, name), AddressForm.NAME: (name,), AddressForm.NONE: (), AddressForm.AGENT_CHOICE: (owned,)}[self]
        return " ".join(part for part in parts if part)

    def instruction(self, called: str) -> str:
        if self is AddressForm.NONE:
            return "Never address me by name or title."
        return f'Address me as "{called}".' if called else ""
