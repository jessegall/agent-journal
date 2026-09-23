from typing import ClassVar

from resources.base import Resource, ResourceDetails
from resources.shapes import NUMBER, TEXT, Field, Shape


class Output(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="command"),
        Field(NUMBER, default=0, name="lines"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Output",
        abstract="The whole output of a command whose middle was cut from what the agent saw",
        help="A shell command that prints more than twice output_lines is shown to the agent by its two ends; the whole output is kept here as a file, to grep or read by range. The last 50 are kept.",
    )
    type = "output"
    icon = "terminal"
    takes_comments = False
    kept = 50
    deduplicates = False
    in_sidebar = False
    notified = ()
