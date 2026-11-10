import json
from collections.abc import Mapping

from engine.types.type_guards import is_mapping
from core.modules.messages.models.message import Message


class MessageCaptions:
    """What the agent said each attached file of a message shows, by file name, kept as JSON on the message.
    """

    @staticmethod
    def decoded(message: Message) -> Mapping[str, str]:
        decoded: object = json.loads(message.captions)
        return {str(name): str(caption) for name, caption in decoded.items()} if is_mapping(decoded) else {}

    @staticmethod
    def adding(message: Message, file: str, text: str) -> str:
        return json.dumps({**json.loads(message.captions), file: text}, sort_keys=True)
