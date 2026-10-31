from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.messages.models.enums.message_mark_type import MessageMarkType


class SampleHandler:
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command, context):
        # @sin architecture_chat_MarkShownByListenerDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, "summary", "key", "words"), context.actor)


class SampleListener(CommitListener):
    name = "samples.mark"
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event):
        # @righteous architecture_chat_MarkShownByListenerDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, "summary", "key", "words"), event.actor)


def sample_declarations() -> None:
    # @sin architecture_chat_NoRawMarkTypeDetector
    MarkDeclaration("messages.thought", MessageMarkVariant, FAMILY, "Thoughts", "summary")
    # @righteous architecture_chat_NoRawMarkTypeDetector
    MarkDeclaration(MessageMarkType.THOUGHT, MessageMarkVariant, FAMILY, "Thoughts", "summary")
