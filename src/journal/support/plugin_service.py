from dataclasses import dataclass


@dataclass(frozen=True)
class PluginService:
    """A process a plugin keeps running beside it: its name, its command, the shell test that says whether it runs here, its restart policy, and whether it answers the plugin's events."""

    name: str
    command: tuple[str, ...]
    condition: str = ""
    restart: str = ""
    answers: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "PluginService":
        return cls(**{**data, "command": tuple(data["command"])})

    @property
    def program(self) -> str:
        return self.command[0]

    @property
    def is_local(self) -> bool:
        return "/" in self.program
