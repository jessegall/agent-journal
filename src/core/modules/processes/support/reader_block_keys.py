import re
from dataclasses import replace

from engine.driver.nudge import Nudge
from core.modules.processes.nudges.reader_block_nudge import ReaderBlockNudge
from core.modules.processes.nudges.reader_request_refusal_nudge import ReaderRequestRefusalNudge

READER_BLOCK_KEY = re.compile(rf"(?:{re.escape(ReaderBlockNudge.declared().key)}|{re.escape(ReaderRequestRefusalNudge.declared().key)})\.(\d+)")


class ReaderBlockKeys:
    """The key of the block of a reader request: the key of the nudge with the number of the request after it. The
    one place that writes it and the one place that reads the request back."""

    @staticmethod
    def keyed(nudge: Nudge, request_id: int) -> Nudge:
        return replace(nudge, key=f"{nudge.key}.{request_id}")

    @staticmethod
    def request_id(nudge_key: str) -> int | None:
        matched = READER_BLOCK_KEY.fullmatch(nudge_key)
        return int(matched.group(1)) if matched is not None else None
