from dataclasses import dataclass


@dataclass(frozen=True)
class SecretField:
    """One value of a secret: its name, whether it is hidden from every screen, and the environment variable a program receives it in."""

    name: str
    hidden: bool
    variable: str

    @classmethod
    def of(cls, raw: dict) -> "SecretField":
        return cls(raw["name"], bool(raw.get("hidden", True)), raw["variable"])
