from dataclasses import dataclass

from engine.enums.command_category import CommandCategory
from core.modules.plugins.models.enums.run_scope import RunScope


@dataclass(frozen=True)
class ManifestProcessKind:
    """A kind of run a plugin starts through the journal: its name, a title a person reads, the command category
    it is queued as, the plugin setting that says how many runs of it may run at once, whether that count is of
    this project or of the whole machine, the free memory in megabytes a run waits for, and whether a second
    waiting run of the same command in the same folder joins the first."""

    kind: str
    title: str
    category: CommandCategory
    at_once_setting: str
    scope: RunScope = RunScope.PROJECT
    memory_mb: int = 0
    coalesce: bool = False
