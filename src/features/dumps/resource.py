from typing import ClassVar

from resources.base import DOCUMENT, Resource, ResourceDetails
from resources.shapes import Field, Shape, names

ITEM = names("insight", "outcome", "refs", "failed")
ENTRY = names("at", "text", "on", "making", "detail")


class Dump(Shape, Resource):
    listed_open = True
    type = "dump"
    event_labels = {"created": "Dumped", "completed": "Dump filed"}
    status_labels = {"note": "reading a dump", "filed": "filing a dump"}
    data_fields: ClassVar[list[Field]] = [
        Field(default=dict, name="items"),
        Field(default=list, name="log"),
    ]
    needs_attention = True
    read_whole = True
    in_sidebar = False
    icon = "inbox"
    command_names = {"complete": "close"}
    labels = {"brief": "What you dumped", "outcome": "Filed"}
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Dump",
        abstract="Raw material the user drops in one place, which the agent reads and files into the record",
        help=("A dump holds pasted text (its brief) and dropped files; each is an item. The agent decides what every item "
              "becomes and files it: journal dump note <n> <item> \"<what it is>\", then journal dump filed <n> <item> "
              "\"<what it did>\" \"<ref, ref>\" or journal dump failed <n> <item> \"<why>\". journal dump log <n> \"<status>\" "
              "tells the user what it is doing. journal dump items <n> lists where every item stands; the dump closes by "
              "itself once every item is filed or failed. One dump is worked at a time; the next waits until it closes."),
    )
    view = DOCUMENT
