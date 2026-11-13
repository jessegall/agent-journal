from collections.abc import Mapping
from dataclasses import dataclass
from itertools import count


@dataclass(frozen=True)
class SecretField:
    """One value of a secret: its name, whether it is hidden, and the environment variable a program receives
    it in, which also names it in the values file."""

    name: str
    hidden: bool
    variable: str

    @classmethod
    def made(cls, stem: str, name: str, hidden: bool) -> "SecretField":
        return cls(name, hidden, f"{stem}_{name.upper()}")

    # The start of the variables of fields made for this title: the title in capitals, numbered from 2 when another
    # secret's field has one of the variables, so no two secrets share a value.
    @staticmethod
    def free_stem(title: str, names: tuple[str, ...], used_variables: frozenset[str]) -> str:
        title_stem = "_".join("".join(character if character.isalnum() else " " for character in title).upper().split())
        stems = (title_stem if number == 1 else f"{title_stem}_{number}" for number in count(1))
        return next(stem for stem in stems if not any(f"{stem}_{name.upper()}" in used_variables for name in names))

    @classmethod
    def parsed(cls, raw: Mapping[str, object]) -> "SecretField":
        return cls(str(raw["name"]), bool(raw.get("hidden", True)), str(raw["variable"]))

    def stored(self) -> dict[str, object]:
        return {"name": self.name, "hidden": self.hidden, "variable": self.variable}
