from dataclasses import dataclass

from engine.model.event_form import EventForm
from engine.model.model import Model

CONFIG_CHANGED = "config_changed"


@dataclass(frozen=True, kw_only=True)
class Plugin(Model):
    """A program the person installed that hears the journal's events: where it came from, its version,
    whether it is switched on, the digest of its files when the person last took them, its faults in a
    row, and the last good copy of its config with its version and the places the last change touched."""

    model_name = "plugin"
    event_forms = tuple([EventForm.COMMIT])
    cli_name = "plugin"
    search_fields = ["name", "title"]
    change_names = tuple([CONFIG_CHANGED])

    creator_id: int
    name: str
    title: str
    source: str
    release: str
    enabled: bool = True
    files_digest: str = ""
    last_fault: str = ""
    fault_count: int = 0
    failing: bool = False
    config_version: int = 0
    config_digest: str = ""
    config_document: str = "null"
    config_pointers: str = "[]"

    def change_name(self, old_row: Model | None) -> str | None:
        if not isinstance(old_row, Plugin) or old_row.config_version == self.config_version:
            return None
        return CONFIG_CHANGED
