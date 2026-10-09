import time
from dataclasses import dataclass, replace
from typing import ClassVar

from features.message_buttons.shaping import Button, whole
from resources.base import DOCUMENT, Resource, ResourceDetails
from resources.shapes import FLAG, Field, Shape, names

ITEM = names("insight", "outcome", "refs", "failed", "added")
ENTRY = names("at", "text", "on", "making", "detail")
TEXT = "text"


def entry(text: str, on: str = "", making: str = "", detail: str = "", **extra) -> dict:
    return {ENTRY.at: time.time(), ENTRY.text: text.strip(), ENTRY.on: on.strip(), ENTRY.making: making.strip(), ENTRY.detail: detail.strip(), **extra}


@dataclass(frozen=True)
class Offer(Button):
    ask: str = ""

    @classmethod
    def from_payload(cls, raw: dict) -> "Offer":
        offer = cls.from_json(raw)
        return replace(offer, label=offer.label.strip(), ask=offer.ask.strip(), n=whole(offer.n))


@dataclass(frozen=True)
class DumpItem:
    insight: str = ""
    outcome: str = ""
    failed: str = ""

    @classmethod
    def of(cls, raw: dict) -> "DumpItem":
        return cls(raw.get(ITEM.insight, ""), raw.get(ITEM.outcome, ""), raw.get(ITEM.failed, ""))

    @property
    def settled(self) -> bool:
        return bool(self.outcome or self.failed)

    @property
    def standing(self) -> str:
        if self.failed:
            return f"failed - {self.failed}"
        if self.outcome:
            return f"filed - {self.outcome}"
        return f"noted - {self.insight}" if self.insight else "not read yet"


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
    summary_in_dashboard = True
    event_labels = {"created": "Dumped", "completed": "Dump closed"}
    status_labels = {"note": "reading a dump", "filed": "filing a dump"}
    needs_attention = True
    read_whole = True
    in_sidebar = False
    icon = "inbox"
    command_names = {"complete": "close"}
    labels = {"brief": "What you dumped", "outcome": "Filed"}
    view = DOCUMENT

    @property
    def item_names(self) -> list[str]:
        return ((self.data.get("parts") or [TEXT]) if self.brief.strip() else []) + sorted(self.files)

    def item(self, name: str) -> DumpItem:
        return DumpItem.of((self.data.get("items") or {}).get(name) or {})
