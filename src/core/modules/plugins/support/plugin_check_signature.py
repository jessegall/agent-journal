from dataclasses import dataclass


@dataclass(frozen=True)
class PluginCheckSignature:
    """What a kept plugin check was made from: the plugin's version and digest, whether it was upgrading, and the
    size and time of each file the check reads; a kept check holds while its signature does."""

    version: int
    files_digest: str
    is_upgrading: bool
    file_stats: tuple[tuple[str, int, int], ...]
