from dataclasses import dataclass
from pathlib import Path

from core.base.model.event_form import EventForm
from core.base.type_guards import is_mapping


@dataclass(frozen=True)
class ManifestListener:
    """One entry of a manifest's listen list: the key it names and the script of each form, empty where none. An
    entry of the wrong shape is kept and marked wrong, so the card can show it, and a script path that leaves the
    plugin's folder is kept and listed as outside, so it installs and never runs. An entry with skip false cannot be
    passed with --skip-guard."""

    event: str
    guard: str = ""
    listen: str = ""
    commit: str = ""
    is_wrong: bool = False
    outside_scripts: tuple[str, ...] = ()
    allows_skip: bool = True

    @classmethod
    def parsed(cls, entry: object, folder: Path) -> "ManifestListener":
        if not is_mapping(entry) or not isinstance(entry.get("event"), str) or not entry.get("event"):
            return cls(str(entry), is_wrong=True)
        scripts = [str(entry.get(form.value, "")) for form in EventForm]
        guard, listen, commit = scripts
        return cls(str(entry["event"]), guard, listen, commit, outside_scripts=tuple(script for script in scripts if script and not cls.stays_inside(script, folder)), allows_skip=entry.get("skip") is not False)

    @staticmethod
    def stays_inside(script: str, folder: Path) -> bool:
        return not Path(script).is_absolute() and (folder / script).resolve().is_relative_to(folder.resolve())

    def script(self, form: EventForm) -> str:
        return {EventForm.GUARD: self.guard, EventForm.LISTEN: self.listen, EventForm.COMMIT: self.commit}[form]

    def inside_script(self, form: EventForm) -> str:
        script = self.script(form)
        return "" if self.is_wrong or script in self.outside_scripts else script
