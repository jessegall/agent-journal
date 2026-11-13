from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field

from suites.coding.support.work_field import WorkField


@dataclass(frozen=True)
class WorkPreset:
    """One preset of the workflow controls: its name, a line about it, and the value it gives each control."""

    key: str
    name: str
    line: str
    values: tuple[tuple[str, bool], ...]


@dataclass(frozen=True)
class WorkSettings:
    """The workflow controls of the main agent as a user sees them: the preset they match or custom,
    the revision a change must name, each control's key and value, and the settings of the Tests and
    Advanced tabs."""

    workflow: str
    revision: str
    controls: tuple[tuple[str, bool], ...]
    fields: tuple[WorkField, ...] = ()
    depends: Mapping[str, tuple[str, ...]] = field(default_factory=dict[str, tuple[str, ...]])
    presets: tuple[WorkPreset, ...] = ()
    switches: tuple[tuple[str, str], ...] = ()

    def lines(self) -> Sequence[str]:
        return [f"workflow: {self.workflow}", f"revision: {self.revision}", *(f"{key}: {'on' if value else 'off'}" for key, value in self.controls),
                *(f"{row.key}: {row.value}" for row in self.fields)]

    def json(self) -> Mapping[str, object]:
        return {"workflow": self.workflow, "revision": self.revision, "controls": dict(self.controls), "fields": [asdict(row) for row in self.fields],
                "depends": {key: list(keys) for key, keys in self.depends.items()},
                "presets": [{"key": preset.key, "name": preset.name, "line": preset.line, "values": dict(preset.values)} for preset in self.presets],
                "switches": [{"key": key, "title": title} for key, title in self.switches]}
