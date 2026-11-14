from typing import TypedDict


class DumpItemJsonRecord(TypedDict):
    """The JSON form of an item in DumpBoard.json."""

    id: int
    text: str
    state: str
    note: str
    summary: str
    refs: list[str]
