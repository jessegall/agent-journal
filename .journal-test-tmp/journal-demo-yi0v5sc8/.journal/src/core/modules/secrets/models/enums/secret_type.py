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
        except ValueError as error:
            raise Refusal(f"a secret is one of {', '.join(secret_type.value for secret_type in cls)}, not {text!r}") from error

    def first_fields(self) -> list[tuple[str, bool]]:
        return {SecretType.API_KEY: [("key", True)], SecretType.LOGIN: [("username", False), ("password", True)]}.get(self, [])
