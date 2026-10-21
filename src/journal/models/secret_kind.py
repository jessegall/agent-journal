from enum import StrEnum

from journal.support.rejection import Rejection


class SecretKind(StrEnum):
    API_KEY = "api key"
    LOGIN = "login"
    BROWSER_LOGIN = "browser login"
    CUSTOM = "custom"

    @classmethod
    def lookup(cls, given: str) -> "SecretKind":
        try:
            return cls(given.strip().lower())
        except ValueError as unknown:
            raise Rejection(f"a secret is one of {', '.join(kind.value for kind in cls)}, not {given!r}") from unknown

    def first_fields(self, title: str) -> tuple[dict, ...]:
        stem = "_".join("".join(c if c.isalnum() else " " for c in title).upper().split())
        names = {SecretKind.API_KEY: (("key", True),), SecretKind.LOGIN: (("username", False), ("password", True))}.get(self, ())
        return tuple({"name": name, "hidden": hidden, "variable": f"{stem}_{name.upper()}"} for name, hidden in names)
