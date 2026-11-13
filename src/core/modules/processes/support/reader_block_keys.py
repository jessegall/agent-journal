import re
from dataclasses import replace

from engine.driver.nudge import Nudge
from core.modules.processes.support.process_nudges import READER_BLOCK, READER_REQUEST_REFUSAL

READING_BLOCK_KEY = re.compile(rf"(?:{re.escape(READER_BLOCK.key)}|{re.escape(READER_REQUEST_REFUSAL.key)})\.(\d+)")


class ReaderBlockKeys:
    """The key of the block of a reader request: the key of the nudge with the number of the request after it. The
    one place that writes it and the one place that reads the request back."""

    @staticmethod
    def keyed(nudge: Nudge, request_id: int) -> Nudge:
        return replace(nudge, key=f"{nudge.key}.{request_id}")

    @staticmethod
    def request_id(nudge_key: str) -> int | None:
        matched = READING_BLOCK_KEY.fullmatch(nudge_key)
        return int(matched.group(1)) if matched is not None else None
