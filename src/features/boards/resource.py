from typing import ClassVar

from resources.base import COMMISSIONED, PROJECT, USER, WIDE, Resource, ResourceDetails
from resources.shapes import LIST, NUMBER, Field, Shape

START, REVIEW, DONE = "start", "review", "done"
MEANINGS = (START, REVIEW, DONE)


class Board(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Board",
        abstract="A named board of tickets with stages of its own",
        help="A board holds tickets in stages the user names. A stage can be marked as where work starts, where it waits for "
             "review, or where it is done; the journal acts on a stage only once it is marked.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(LIST, list, name="stages"),
        Field(default=dict, name="meanings"),
        Field(NUMBER, 0, name="expected"),
        Field(default=dict, name="drafting"),
        Field(default=dict, name="building"),
        Field(default=dict, name="added"),
    ]
    type = "board"
    icon = "board"
    scope = PROJECT
    view = WIDE
    in_sidebar = False
    moments = ("created", "completed", COMMISSIONED)
    created_in_viewer = True
    notified = (USER,)
    labels = {"brief": "What it is for", "outcome": "Why closed", "stages": "Stages", "meanings": "What the stages mean"}
    shown_fields = ("stages",)
