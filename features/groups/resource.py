from typing import ClassVar

from resources.base import Resource, ResourceDetails
from resources.shapes import Shape


class Group(Shape, Resource):
    listed_open = True
    type = "group"
    event_labels = {"created": "Group made", "completed": "Group closed"}
    status_labels = {"add": "grouping", "remove": "ungrouping"}
    icon = "folder"
    command_names = {"complete": "close"}
    labels = {"abstract": "What belongs in it"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Group",
        abstract="A named group of any resources that belong together",
        help=("A group's members are its links: journal group add <n> <ref> [<ref> ...] puts any rows in it (todo:785, doc:41, "
              "message:2706), journal group remove <n> <ref> takes one out, journal group members <n> lists them. A row can sit in "
              "several groups."),
    )
