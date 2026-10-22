from dataclasses import dataclass


@dataclass(frozen=True)
class PluginClaim:
    """What a request's headers claim about a plugin sending it: the plugin's name and the token it was given."""

    plugin: str = ""
    token: str = ""

    @classmethod
    def header_claim(cls, headers: dict) -> "PluginClaim":
        return cls(headers.get("x-journal-plugin", ""), headers.get("x-journal-plugin-token", ""))
