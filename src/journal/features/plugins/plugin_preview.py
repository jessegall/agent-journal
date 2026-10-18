from dataclasses import dataclass

from journal.features.plugins.preview_row import PreviewRow


@dataclass(frozen=True)
class PluginPreview:
    """What a plugin is and everything it would run, hear and hold, before it is installed or upgraded; an upgrade's also says what changes."""

    name: str
    title: str
    version: str
    description: str
    source: str
    commit: str
    rows: tuple[PreviewRow, ...]
    linked: bool = False
    was: str = ""
    """The commit an upgrade starts from."""
    changes: tuple[str, ...] = ()
    code: tuple[str, ...] = ()
    current: bool = False
    """True for an upgrade that changes nothing."""
