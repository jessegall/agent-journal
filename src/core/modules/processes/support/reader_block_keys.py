import re
from dataclasses import replace

from engine.driver.agent_message import AgentMessage
from core.modules.processes.nudges.reader_block_message import ReaderBlockMessage
from core.modules.processes.nudges.reader_request_refusal_message import ReaderRequestRefusalMessage

READER_BLOCK_KEY = re.compile(rf"(?:{re.escape(ReaderBlockMessage.declared().key)}|{re.escape(ReaderRequestRefusalMessage.declared().key)})\.(\d+)")


class ReaderBlockKeys:
    """The key of the block of a reader request: the key of the nudge with the number of the request after it. The
    one place that writes it and the one place that reads the request back."""

    @staticmethod
    def keyed(nudge: AgentMessage, request_id: int) -> AgentMessage:
        return replace(nudge, key=f"{nudge.key}.{request_id}")

    @staticmethod
    def request_id(nudge_key: str) -> int | None:
        matched = READER_BLOCK_KEY.fullmatch(nudge_key)
        return int(matched.group(1)) if matched is not None else None
