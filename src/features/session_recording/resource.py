from typing import ClassVar

from resources.base import UNLISTED, Resource, ResourceDetails
from resources.shapes import Field, Shape


class Recording(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Recording",
        abstract="A session recorded into a folder: every moment the journal's record or the project's files changed",
        help="journal record start <folder> records alongside the session into that folder; journal record stop ends it and copies in the transcripts of the agents that ran.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(default="", name="folder", journal_only=True),
        Field(default=0, name="pid", journal_only=True),
    ]
    type = "record"
    icon = "film"
    listed_under = UNLISTED
    in_sidebar = False
    created_in_viewer = False
    subagent_writable = False
    takes_comments = False
