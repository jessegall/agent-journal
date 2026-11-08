from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, field

from suites.coding.support.work_field import WorkField


@dataclass(frozen=True)
class WorkSettings:
    """The workflow controls of the main agent as a person sees them: the preset they match or custom,
    the revision a change must name, each control's key and value, and the settings of the Tests and
    Advanced tabs."""

    workflow: str
    revision: str
    controls: tuple[tuple[str, bool], ...]
    fields: tuple[WorkField, ...] = ()
    depends: Mapping[str, tuple[str, ...]] = field(default_factory=dict)

    def lines(self) -> Sequence[str]:
        return [f"workflow: {self.workflow}", f"revision: {self.revision}", *(f"{key}: {'on' if value else 'off'}" for key, value in self.controls),
                *(f"{row.key}: {row.value}" for row in self.fields)]

    def json(self) -> Mapping[str, object]:
        return {"workflow": self.workflow, "revision": self.revision, "controls": dict(self.controls), "fields": [asdict(row) for row in self.fields],
                "depends": {key: list(keys) for key, keys in self.depends.items()}}
