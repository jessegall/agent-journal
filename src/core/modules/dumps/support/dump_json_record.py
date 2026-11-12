from typing import TypedDict

from core.modules.dumps.support.dump_item_json_record import DumpItemJsonRecord


class DumpJsonRecord(TypedDict):
    """The JSON form of a dump in DumpBoard.json."""

    id: int
    title: str
    brief: str
    outcome: str
    items: list[DumpItemJsonRecord]
