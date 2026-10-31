from dataclasses import dataclass

from core.modules.plugins.models.enums.service_restart import ServiceRestart


@dataclass(frozen=True)
class ManifestService:
    """A process a plugin's manifest keeps running beside the journal: its name, its command inside the
    plugin's folder, the shell line that decides whether it runs here, how it is restarted, and whether it
    answers events on its socket in place of the program."""

    name: str
    command: tuple[str, ...]
    condition: str
    restart: ServiceRestart
    answers: bool
