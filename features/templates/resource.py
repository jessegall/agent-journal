from typing import ClassVar

from resources.base import DOCUMENT, PROJECT, Resource, ResourceDetails
from resources.shapes import LIST, Field, Shape


class Template(Shape, Resource):
    type = "template"
    event_labels = {"created": "Template written", "updated": "Template revised", "completed": "Template retired"}
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="applies_to"),
    ]
    labels = {"brief": "Instructions"}
    icon = "docs"
    command_names = {"complete": "retire"}
    scope = PROJECT
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Template",
        abstract="Instructions put in front of anything made from it, with the parts it starts with",
        help=("A template's brief is its instructions: the agent reads them before working on anything made from it. "
              "Its parts are the skeleton a new resource starts with. applies_to lists the types it is for, such as plan or todo; "
              "an empty list means any type. journal template create \"<name>\" --brief \"<instructions>\" --set applies_to=plan writes one."),
    )
    view = DOCUMENT
