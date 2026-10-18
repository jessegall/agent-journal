from dataclasses import dataclass


@dataclass(frozen=True)
class SetupStep:
    """A step a plugin runs in its folder at install: a name and a shell line."""

    run: str
    name: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "SetupStep":
        return cls(**data)

    @property
    def called(self) -> str:
        return self.name or self.run
