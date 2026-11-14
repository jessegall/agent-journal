from dataclasses import dataclass
from core.modules.plugins.support.manifest_run_type import ManifestRunType


@dataclass(frozen=True)
class PluginRunRule:
    """A plugin's kind of run as one environment holds it: what the manifest declares and how many may run at once,
    none for no limit."""

    declared: ManifestRunType
    limit: int | None
