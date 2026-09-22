from typing import ClassVar

from resources.base import DOCUMENT, PROJECT, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape


class Sequence(Shape, Resource):
    type = "sequence"
    event_labels = {"created": "Sequence written", "updated": "Sequence moved on", "completed": "Sequence retired"}
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="starts_on"),
        Field(FLAG, False, name="system"),
        Field(default=dict, name="runs"),
    ]
    indexed = ("starts_on",)
    progress = ("runs", "abandoned")
    labels = {"brief": "What it is for"}
    icon = "list"
    command_names = {"complete": "retire"}
    scope = PROJECT
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Sequence",
        abstract="Steps the agent follows in order, one at a time, started by hand or by a moment",
        help=("A sequence's parts are its steps, in order: the title names the step and the body says what to do. "
              "journal sequence run <n> --about <ref> hands the agent the first step, and journal sequence next <n> --about <ref> "
              "marks the step in hand done and hands the next. --set starts_on=<type.action>, such as dump.created, starts it by itself "
              "when that happens, about the row it happened to. A system sequence ships with the journal and cannot be removed."),
    )
    view = DOCUMENT
    listed_as_cards = True
