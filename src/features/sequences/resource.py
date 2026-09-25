from typing import ClassVar

from resources.base import DOCUMENT, PROJECT, SIDEBAR, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape


class Sequence(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="starts_on"),
        Field(default="", name="started_by"),
        Field(FLAG, False, name="system"),
        Field(FLAG, False, name="only_when_idle"),
        Field(default="", name="talks_in"),
        Field(FLAG, False, name="lasting"),
        Field(default=dict, name="runs"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Sequence",
        abstract="Steps the agent follows in order, one at a time, started by hand or by a moment",
        help=("A sequence's parts are its steps, in order: the title names the step and the body says what to do. "
              "journal sequence run <n> --about <ref> hands the agent the first step, and journal sequence next <n> --about <ref> "
              "marks the step in hand done and hands the next. --set starts_on=<type>.created, <type>.completed, message.requested or trigger:<n> starts it "
              "by itself, about the row it started on, --set started_by=user only when the user made that row; a trigger with does=start starts it on words or a command. "
              "A system sequence ships with the journal and cannot be removed."),
    )
    type = "sequence"
    listed_under = SIDEBAR
    event_labels = {"created": "Sequence written", "updated": "Sequence moved on", "completed": "Sequence retired"}
    indexed = ("starts_on", "started_by", "only_when_idle")
    progress = ("runs", "abandoned")
    labels = {"brief": "What it is for"}
    icon = "list"
    command_names = {"complete": "retire"}
    scope = PROJECT
    view = DOCUMENT
    listed_as_cards = True
