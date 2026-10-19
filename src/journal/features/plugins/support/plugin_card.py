from dataclasses import dataclass


@dataclass(frozen=True)
class PluginCard:
    """A card a plugin's answer shows in the chat: its kind from the plugin's manifest, its words, and a key, so a later card of the same key replaces it."""

    kind: str = ""
    label: str = ""
    tone: str = ""
    detail: str = ""
    key: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "PluginCard":
        return cls(**{name: str(data[name]) for name in ("kind", "label", "tone", "detail", "key") if data.get(name) is not None})
