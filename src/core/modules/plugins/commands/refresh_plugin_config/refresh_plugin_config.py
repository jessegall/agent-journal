from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.plugins.models.plugin import Plugin


@dataclass(frozen=True)
class RefreshPluginConfig(Command[Plugin]):
    """Takes in a plugin's config file, or first writes a new document into it, whole or as values set at JSON
    pointers: a valid one becomes the next version, an invalid one is refused, or, when it was edited by hand, keeps
    the last good copy and records the fault."""

    plugin_id: int
    document_text: str | None = None
    changes: tuple[tuple[str, object], ...] = ()
