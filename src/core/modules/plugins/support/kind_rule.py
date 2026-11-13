from dataclasses import dataclass
from core.modules.plugins.support.manifest_process_kind import ManifestProcessKind


@dataclass(frozen=True)
class KindRule:
    """A plugin's kind of run as one environment holds it: what the manifest declares and how many may run at once,
    none for no limit."""

    declared: ManifestProcessKind
    limit: int | None
