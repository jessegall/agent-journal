from dataclasses import dataclass

from engine.enums.command_category import CommandCategory


@dataclass(frozen=True)
class ManifestProcessKind:
    """A kind of run a plugin starts through the journal: its name, a title a person reads, the command category
    it is queued as, and the plugin setting that says how many runs of it may run at once."""

    kind: str
    title: str
    category: CommandCategory
    at_once_setting: str
