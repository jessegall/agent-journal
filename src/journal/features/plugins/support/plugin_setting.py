from dataclasses import dataclass


@dataclass(frozen=True)
class PluginSetting:
    """One setting a plugin's schema names: its key, its kind, the words the page shows for it, its default and, for a choice, the choices."""

    key: str
    kind: str
    title: str = ""
    help: str = ""
    default: object = None
    choices: tuple[str, ...] = ()

    @classmethod
    def from_json(cls, data: dict) -> "PluginSetting":
        return cls(data["key"], data["kind"], data.get("title") or data["key"], data.get("help", ""), data.get("default"), tuple(data.get("choices", ())))

    @property
    def is_secret(self) -> bool:
        return self.kind == "secret"
