from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass, fields, replace
from typing import Any

from core.base.dotted_path.dotted_path import DottedPath
from core.base.model.model import Model
from core.base.model.view_model import ViewModel
from core.base.viewer.button_declaration import ButtonDeclaration
from core.base.viewer.inspector_component import InspectorComponent
from core.base.viewer.inspector_links import InspectorLinks
from core.base.viewer.inspector_width import InspectorWidth


@dataclass(frozen=True)
class InspectorDeclaration:
    """The inspector of one model: the line that reads its row, its label, title and description written with the row's
    fields in braces, its width, the actions on the row, the parts the module draws itself, the events that reload it
    its links section (None for a row that has none) and whether it lists the row's fields. `named` is the noun of a row no model of that noun holds,
    such as the test queue; the model is then the one that supplies its data."""

    model: type[Model] | type[ViewModel]
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
    named: str = ""
    lists_fields: bool = True

    @classmethod
    def default_for(cls, model: type[Model] | type[ViewModel]) -> "InspectorDeclaration":
        """The inspector of a model no module declares one for: its title is `{title}`, or `{name}` for a model with a name and no title."""
        names = {field.name for field in fields(model)}
        return cls(model, title="{name}" if "name" in names and "title" not in names else "{title}")

    @property
    def noun(self) -> str:
        return self.named or self.model.cli_name

    def read_line(self) -> str:
        """The read subcommand that loads the row: the first two words of `reads`, or `<noun> show` when it is empty."""
        return " ".join(self.reads.split()[:2]) if self.reads else f"{self.noun} show"

    def read_noun(self) -> str:
        return self.model.cli_name if self.named else self.read_line().split()[0]

    def slotted_actions(self) -> tuple[ButtonDeclaration, ...]:
        """The actions as ordinary buttons, each also on the row slot of this model."""
        slot = f"row.{self.noun}"
        return tuple(action if slot in action.slots else replace(action, slots=(*action.slots, slot)) for action in self.actions)

    def stored(self) -> dict[str, Any]:
        return {**asdict(self), "model": DottedPath.class_path(self.model).text}

    @classmethod
    def restored(cls, stored: Mapping[str, Any]) -> "InspectorDeclaration":
        links = stored.get("links")
        return cls(model=DottedPath(stored["model"]).checked_class(ViewModel if stored.get("named") else Model), reads=stored.get("reads", ""), label=stored.get("label", ""),
                   title=stored.get("title", "{title}"), description=stored.get("description", ""), width=InspectorWidth(stored.get("width", InspectorWidth.SMALL)),
                   actions=tuple(ButtonDeclaration.restored(action) for action in stored.get("actions", ())),
                   components=tuple(InspectorComponent(**component) for component in stored.get("components", ())),
                   comments=stored.get("comments", False), events=tuple(stored.get("events", ())),
                   links=InspectorLinks(**{**links, "kinds": tuple(links["kinds"])}) if links is not None else None, named=stored.get("named", ""),
                   lists_fields=stored.get("lists_fields", True))
