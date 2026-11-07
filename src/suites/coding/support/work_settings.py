from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class WorkField:
    """One setting of the Tests or Advanced tab: its group, title, description and type, the value it holds and where it comes from."""

    key: str
    group: str
    title: str
    description: str
    type: str
    value: object
    source: str


@dataclass(frozen=True)
class WorkSettings:
    """The workflow controls of the main agent as a person sees them: the preset they match or custom, the revision a
    change must name, each control's key and value, and the settings of the Tests and Advanced tabs."""

    workflow: str
    revision: str
    controls: tuple[tuple[str, bool], ...]
    fields: tuple[WorkField, ...] = ()

    def lines(self) -> Sequence[str]:
        return [f"workflow: {self.workflow}", f"revision: {self.revision}", *(f"{key}: {'on' if value else 'off'}" for key, value in self.controls),
                *(f"{field.key}: {field.value}" for field in self.fields)]

    def json(self) -> Mapping[str, object]:
        return {"workflow": self.workflow, "revision": self.revision, "controls": dict(self.controls), "fields": [asdict(field) for field in self.fields]}
