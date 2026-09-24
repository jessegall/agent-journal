from typing import ClassVar

from resources.base import DOCUMENT, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape, names

ITEM = names("insight", "outcome", "refs", "failed", "added")
ENTRY = names("at", "text", "on", "making", "detail")


class Dump(Shape, Resource):
    data_fields: ClassVar[list[Field]] = [
        Field(default=dict, name="items"),
        Field(default=list, name="log"),
        Field(FLAG, False, name="dismissed"),
    ]
    details: ClassVar[ResourceDetails] = ResourceDetails(
        title="Dump",
        abstract="A pile the user drops in one place, which the agent sorts by subject and files straight into a collection",
        help=("A dump holds pasted text (its brief) and dropped files; each is an item. The agent sorts them by subject, one "
              "document per subject with a proper name, and files each straight into the dump's collection: journal dump "
              "note <n> <item> \"<what it is>\", then journal dump filed <n> <item> \"<what it did>\" \"<ref, ref>\" "
              "--added \"<ref>\" for what it wrote unasked, or journal dump failed <n> <item> \"<why>\". journal dump log <n> "
              "\"<status>\" tells the user what it is doing. journal dump items <n> lists where every item stands; the dump "
              "closes by itself once every item is filed or failed. One dump is worked at a time; the next waits until it "
              "closes. Only the user removes a dump's collection with everything it made: journal dump remove <n>."),
    )
    listed_open = True
    type = "dump"
    event_labels = {"created": "Dumped", "completed": "Dump filed"}
    status_labels = {"note": "reading a dump", "filed": "filing a dump"}
    needs_attention = True
    read_whole = True
    in_sidebar = False
    icon = "inbox"
    command_names = {"complete": "close"}
    labels = {"brief": "What you dumped", "outcome": "Filed"}
    view = DOCUMENT
