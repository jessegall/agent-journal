from typing import ClassVar

from resources.base import UNLISTED, Resource, ResourceDetails
from resources.shapes import Field, Shape


class Critique(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Critique round",
        abstract="A design critique round: one read-only critic per lens looks at the app, and their findings gather into one report",
        help="journal critique round \"<what changed>\" --critics 3 starts one; recheck says how to send the same critics back after a revision; finish ends it.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(default=0, name="report"),
        Field(default=list, name="critics"),
    ]
    type = "critique"
    icon = "report"
    listed_under = UNLISTED
    in_sidebar = False
    created_in_viewer = False
    subagent_writable = False
    takes_comments = False
    command_names = {"complete": "finish"}
