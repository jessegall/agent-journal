from typing import TypedDict

from core.modules.dumps.support.dump_json_record import DumpJsonRecord


class DumpBoardJsonRecord(TypedDict):
    """The JSON form of DumpBoard.json."""

    total: int
    dumps: list[DumpJsonRecord]
