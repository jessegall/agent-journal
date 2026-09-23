from dataclasses import asdict, dataclass
from typing import ClassVar

from engine.fields import Loaded

from resources.base import DOCUMENT, PROJECT, Resource, ResourceDetails
from resources.shapes import LIST, TEXT, Field, Shape


@dataclass(frozen=True)
class TemplateField(Loaded):
    name: str = ""
    label: str = ""
    kind: str = ""
    options: tuple = ()
    default: str = ""

    def to_json(self) -> dict:
        return {**asdict(self), "options": list(self.options)}


class Template(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="applies_to"),
        Field(LIST, list, name="fields"),
        Field(TEXT, name="purpose"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Template",
        abstract="Instructions put in front of anything made from it, with the parts it starts with",
        help=("A template's brief is its instructions: the agent reads them before working on anything made from it. "
              "Its parts are the skeleton a new resource starts with. applies_to lists the types it is for, such as plan or todo; "
              "an empty list means any type. journal template create \"<name>\" --brief \"<instructions>\" --set applies_to=plan writes one."),
    )
    type = "template"
    event_labels = {"created": "Template written", "updated": "Template revised", "completed": "Template retired"}
    labels = {"brief": "Instructions"}
    icon = "docs"
    command_names = {"complete": "retire"}
    scope = PROJECT
    view = DOCUMENT

    @property
    def declared_fields(self) -> list[TemplateField]:
        return [TemplateField.from_json(given) for given in self.data.get("fields", []) if isinstance(given, dict)]
