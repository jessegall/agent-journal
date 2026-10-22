from dataclasses import asdict, dataclass

PUBLISHED = {"when": "condition"}


@dataclass(frozen=True)
class PluginService:
    """A process a plugin keeps running beside it: its name, its command, the shell test that says whether it runs here, its restart policy, and whether it answers the plugin's events; its when key is read into condition."""

    name: str
    command: tuple[str, ...]
    condition: str = ""
    restart: str = ""
    answers: bool = False

    @classmethod
    def parsed(cls, data: dict) -> "PluginService":
        return cls(**{PUBLISHED.get(key, key): value for key, value in data.items()} | {"command": tuple(data["command"])})

    def published(self) -> dict:
        names = {field: key for key, field in PUBLISHED.items()}
        return {names.get(name, name): value for name, value in asdict(self).items()}

    @property
    def program(self) -> str:
        return self.command[0]

    @property
    def is_local(self) -> bool:
        return "/" in self.program
