import json
from collections.abc import Mapping

from core.modules.messages.models.message import Message


class MessageCaptions:
    """What the agent said each attached file of a message shows, by file name, kept as JSON on the message."""

    @staticmethod
    def of(message: Message) -> Mapping[str, str]:
        return json.loads(message.captions)

    @staticmethod
    def adding(message: Message, file: str, text: str) -> str:
        return json.dumps({**json.loads(message.captions), file: text}, sort_keys=True)
