from typing import ClassVar

from resources.base import PROJECT, Resource, ResourceDetails
from resources.shapes import NUMBER, TEXT, Field, Shape

SHARED_TYPES = ("doc", "collection")


class Share(Shape, Resource):
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Share",
        abstract="A link that lets someone outside the journal view one document or collection, and nothing else",
        help="journal share create <ref> makes one and prints its link and what it opens; journal share stop <n> ends it at once.",
    )
    data_fields: ClassVar[list[Field]] = [
        Field(TEXT, name="target"),
        Field(TEXT, name="token"),
        Field(NUMBER, default=0, name="expires"),
        Field(NUMBER, default=0, name="views"),
    ]
    type = "share"
    icon = "share"
    scope = PROJECT
    indexed = ("target", "token", "expires")
    command_names = {"complete": "stop"}
