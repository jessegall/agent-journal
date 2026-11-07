from collections.abc import Mapping, Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class WorkSettings:
    """The seven workflow controls of the main agent as a person sees them: the preset they match or custom, the
    revision a change must name, and each control's key and value."""

    workflow: str
    revision: str
    controls: tuple[tuple[str, bool], ...]

    def lines(self) -> Sequence[str]:
        return [f"workflow: {self.workflow}", f"revision: {self.revision}", *(f"{key}: {'on' if value else 'off'}" for key, value in self.controls)]

    def json(self) -> Mapping[str, object]:
        return {"workflow": self.workflow, "revision": self.revision, "controls": dict(self.controls)}
