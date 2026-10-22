from sync_server.blocks_answer import BlocksAnswer
from sync_server.devices import Devices
from sync_server.id_block_grant import IdBlockGrant
from sync_server.id_ranges import IdRanges

DEFAULT_BLOCK_ROWS = 500
BLOCK_ROWS = {"messages": 5000, "links": 5000, "edits": 5000, "reactions": 2000, "task_logs": 2000, "doc_revisions": 1000}


class BlocksHandler:
    """Hands a device a block of row numbers for each table it asks for, sized by how fast the table grows: a hundred messages last about an hour, so messages and links get far bigger blocks than plans."""

    def __init__(self, ranges: IdRanges, devices: Devices) -> None:
        self.ranges, self.devices = ranges, devices

    def answer(self, token: str, tables: list[str]) -> BlocksAnswer:
        device = self.devices.device(token)
        return BlocksAnswer(tuple(IdBlockGrant(table, *self.ranges.block(device.id, table, BLOCK_ROWS.get(table, DEFAULT_BLOCK_ROWS))) for table in tables))
