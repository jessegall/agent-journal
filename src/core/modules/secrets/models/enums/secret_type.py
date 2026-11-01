from enum import StrEnum

from core.base.refusal import Refusal


class SecretType(StrEnum):
    """What a secret holds: an API key, a login with a username and a password, or the fields it names."""

    API_KEY = "api key"
    LOGIN = "login"
    CUSTOM = "custom"

    @classmethod
    def lookup(cls, text: str) -> "SecretType":
        try:
            return cls(text.strip().lower())
        except ValueError as unknown:
            raise Refusal(f"a secret is one of {', '.join(kind.value for kind in cls)}, not {text!r}") from unknown

    def first_fields(self) -> tuple[tuple[str, bool], ...]:
        return {SecretType.API_KEY: (("key", True),), SecretType.LOGIN: (("username", False), ("password", True))}.get(self, ())
