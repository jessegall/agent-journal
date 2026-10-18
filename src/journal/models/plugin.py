from dataclasses import dataclass, field
from datetime import datetime

from journal.models.model import Model
from journal.models.plugin_manifest import PluginManifest


@dataclass(frozen=True)
class Plugin(Model):
    """A plugin installed in the project: where it came from, whether it is on, its manifest as read at install, its settings, and how it last failed."""

    name: str = ""
    source: str = ""
    """The git address or the folder it was installed from."""
    commit_sha: str = ""
    """The commit it was installed at, for one installed from git."""
    linked: bool = False
    """Read where it lies rather than copied into the journal's plugins folder."""
    enabled: bool = True
    manifest: PluginManifest = field(default_factory=PluginManifest)
    settings: dict = field(default_factory=dict)
    hashes: dict = field(default_factory=dict)
    """Each file it runs, by path, with its hash at install, checked before each run."""
    waiting: str = ""
    """The hash of a linked folder's changed manifest already shown to the user, waiting for their upgrade."""
    last_fault: str = ""
    faults_in_a_row: int = 0
    failing_since: datetime | None = None
