from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass
from typing import Any

from core.base.dotted_path.dotted_path import DottedPath
from core.base.model.model import Model
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_links import InspectorLinks
from core.base.viewer.inspector_width import InspectorWidth


@dataclass(frozen=True)
class InspectorDeclaration:
    """The inspector of one model: the line that reads its row, its label, title and description written with the row's
    fields in braces, its width, the actions on the row, the parts the module draws itself, the events that reload it
    and its links section (None for a row that has none)."""

    model: type[Model]
    reads: str = ""
    label: str = ""
    title: str = "{title}"
    description: str = ""
    width: InspectorWidth = InspectorWidth.SMALL
    actions: Sequence[ButtonDeclaration] = ()
    components: Sequence[InspectorComponent] = ()
    comments: bool = False
    events: Sequence[str] = ()
    links: InspectorLinks | None = InspectorLinks()

    def stored(self) -> dict[str, Any]:
        return {**asdict(self), "model": DottedPath.class_path(self.model).text}

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "InspectorDeclaration":
        links = stored.get("links")
        return cls(model=DottedPath(stored["model"]).checked_class(Model), reads=stored.get("reads", ""), label=stored.get("label", ""),
                   title=stored.get("title", "{title}"), description=stored.get("description", ""), width=InspectorWidth(stored.get("width", InspectorWidth.SMALL)),
                   actions=tuple(ButtonDeclaration.restored(action) for action in stored.get("actions", ())),
                   components=tuple(InspectorComponent(**component) for component in stored.get("components", ())),
                   comments=stored.get("comments", False), events=tuple(stored.get("events", ())),
                   links=InspectorLinks(**{**links, "kinds": tuple(links["kinds"])}) if links is not None else None)
