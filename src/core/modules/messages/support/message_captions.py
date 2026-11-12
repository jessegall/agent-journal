import json
from collections.abc import Mapping
from pathlib import PurePath

from engine.types.type_guards import is_mapping
from core.modules.messages.models.message import Message

IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp")


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

    @staticmethod
    def untagged_images(message: Message) -> tuple[str, ...]:
        """The attached pictures of the message that have no caption yet."""
        captions = MessageCaptions.decoded(message)
        return tuple(name for name in message.files if PurePath(name).suffix.lower() in IMAGE_SUFFIXES and name not in captions)
