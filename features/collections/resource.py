from typing import ClassVar

from resources.base import Resource, ResourceDetails
from resources.shapes import Shape


class Collection(Shape, Resource):
    listed_open = True
    type = "collection"
    event_labels = {"created": "Collection made", "completed": "Collection closed"}
    status_labels = {"add": "collecting", "remove": "taking out of a collection"}
    icon = "folder"
    listed_as_cards = True
    command_names = {"complete": "close"}
    labels = {"abstract": "What belongs in it"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Collection",
        abstract="A named collection of any resources that belong together",
        help=("A collection's members are its links: journal collection add <n> <ref> [<ref> ...] puts any rows in it (todo:785, doc:41, "
              "message:2706), journal collection remove <n> <ref> takes one out, journal collection members <n> lists them. A row can "
              "sit in several collections."),
    )
