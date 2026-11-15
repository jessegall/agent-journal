import re
from dataclasses import replace

from engine.driver.agent_message import AgentMessage
from core.modules.processes.agent_messages.reader_block_message import ReaderBlockMessage
from core.modules.processes.agent_messages.reader_request_refusal_message import ReaderRequestRefusalMessage

READER_BLOCK_KEY = re.compile(rf"(?:{re.escape(ReaderBlockMessage.declared().key)}|{re.escape(ReaderRequestRefusalMessage.declared().key)})\.(\d+)")


class ReaderBlockKeys:
    """The key of the block of a reader request: the key of the agent message with the number of the request after it. The
    one place that writes it and the one place that reads the request back."""

    @staticmethod
    def keyed(agent_message: AgentMessage, request_id: int) -> AgentMessage:
        return replace(agent_message, key=f"{agent_message.key}.{request_id}")

    @staticmethod
    def request_id(agent_message_key: str) -> int | None:
        matched = READER_BLOCK_KEY.fullmatch(agent_message_key)
        return int(matched.group(1)) if matched is not None else None
