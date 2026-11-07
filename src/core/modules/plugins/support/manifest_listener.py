from dataclasses import dataclass
from pathlib import Path

from core.base.model.event_form import EventForm
from core.base.type_guards import is_mapping


SERVICE_PREFIX = "service:"


@dataclass(frozen=True)
class ManifestListener:
    """A manifest event subscription and its scripts, including invalid entries and paths."""

    event: str
    guard: str = ""
    listen: str = ""
    commit: str = ""
    is_wrong: bool = False
    external_scripts: tuple[str, ...] = ()
    allows_skip: bool = True
    window_ms: int | None = None

    @classmethod
    def parsed(cls, entry: object, folder: Path) -> "ManifestListener":
        if not is_mapping(entry) or not isinstance(entry.get("event"), str) or not entry.get("event"):
            return cls(str(entry), is_wrong=True)
        scripts = [str(entry.get(form.value, "")) for form in EventForm]
        guard, listen, commit = scripts
        return cls(str(entry["event"]), guard, listen, commit, external_scripts=tuple(script for script in scripts if script and not script.startswith(SERVICE_PREFIX) and not cls.is_contained_path(script, folder)), allows_skip=entry.get("skip") is not False, window_ms=cls.declared_window(entry.get("window_ms")))

    @staticmethod
    def declared_window(value: object) -> int | None:
        return value if isinstance(value, int) and not isinstance(value, bool) and value > 0 else None

    @staticmethod
    def is_contained_path(script: str, folder: Path) -> bool:
        return not Path(script).is_absolute() and (folder / script).resolve().is_relative_to(folder.resolve())

    def script(self, form: EventForm) -> str:
        return {EventForm.GUARD: self.guard, EventForm.LISTEN: self.listen, EventForm.COMMIT: self.commit}[form]

    def allowed_script(self, form: EventForm) -> str:
        script = self.script(form)
        return "" if self.is_wrong or script in self.external_scripts else script
