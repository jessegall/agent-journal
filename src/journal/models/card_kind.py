from dataclasses import dataclass


@dataclass(frozen=True)
class CardKind:
    """A kind of card a plugin's manifest declares: the label, icon and tone its cards take unless a card says its own, and whether it shows folded."""

    kind: str
    label: str
    icon: str = "plug"
    tone: str = ""
    collapsed: bool = False

    @classmethod
    def named(cls, manifest: dict, kind: str, plugin: str) -> "CardKind":
        """The kind the manifest declares under that name; one it does not declare takes the plugin's name and the plug."""
        declared = next((k for k in manifest.get("cards", ()) if k.get("kind") == kind), {})
        return cls(kind, declared.get("label", plugin), declared.get("icon", "plug"), declared.get("tone", ""), bool(declared.get("collapsed")))
