from typing import ClassVar

from resources.base import PROJECT, USER, Resource, ResourceDetails
from resources.shapes import NUMBER, TEXT, Field, Shape


class Check(Shape, Resource):
    type = "check"
    icon = "check"
    scope = PROJECT
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Check",
        abstract="A script that says pass or fail about the project, run by hand, by its button, or every so many minutes",
        help="A check names the command it runs from the project root and how often; exit 0 passes, anything else fails and its output says why. journal check run <n> runs one, journal check sweep runs every check.",
    )
    command_names = {"complete": "retire"}
    notified = (USER,)
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="command"),
        Field(NUMBER, default=0, name="every"),
        Field(TEXT, name="failure"),
        Field(default=dict, name="last"),
        Field(default=dict, name="running"),
        Field(default=list, name="runs"),
    ]
    view = "check"
