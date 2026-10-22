from dataclasses import dataclass, field
from datetime import datetime

from journal.models.model import Model
from journal.models.support.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class Plugin(Model):
    """A plugin installed in the project: where it came from, whether it is on, its manifest as read at install, its settings, and how it last failed."""

    name: str = ""
    source: str = ""
    commit_sha: str = ""
    release: str = ""
    linked: bool = False
    enabled: bool = True
    manifest: PluginManifest = field(default_factory=PluginManifest)
    settings: dict = field(default_factory=dict)
    hashes: dict = field(default_factory=dict)
    waiting: str = ""
    last_fault: str = ""
    fault_streak: int = 0
    failed_at: datetime | None = None
