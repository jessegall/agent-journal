from collections.abc import Mapping
from dataclasses import dataclass


@dataclass(frozen=True)
class SecretField:
    """One value of a secret: its name, whether it is hidden, and the environment variable a program receives
    it in, which also names it in the values file."""

    name: str
    hidden: bool
    variable: str

    @classmethod
    def made(cls, title: str, name: str, hidden: bool) -> "SecretField":
        stem = "_".join("".join(character if character.isalnum() else " " for character in title).upper().split())
        return cls(name, hidden, f"{stem}_{name.upper()}")

    @classmethod
    def parsed(cls, raw: Mapping[str, object]) -> "SecretField":
        return cls(str(raw["name"]), bool(raw.get("hidden", True)), str(raw["variable"]))

    def stored(self) -> dict[str, object]:
        return {"name": self.name, "hidden": self.hidden, "variable": self.variable}
