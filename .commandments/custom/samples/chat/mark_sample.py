from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.docking.commands.add_dock_item import AddDockItem
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant


class SampleHandler:
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command, context):
        # @sin architecture_chat_MarkShownByListenerDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "key", "words"), context.actor)


class SampleRoute:
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def answer(self, window, argv, person):
        # @sin architecture_chat_MarkShownByListenerDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "button", "words"), person)


class SampleListener(CommitListener):
    name = "samples.mark"
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event):
        # @righteous architecture_chat_MarkShownByListenerDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "key", "words"), event.actor)


class SampleRawListener(CommitListener):
    name = "samples.raw-mark"
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event):
        # @sin architecture_chat_NoRawMarkTypeDetector
        self.bus.run(ShowMark(1, "messages.thought", MessageMarkVariant.SUMMARY, "key", "words"), event.actor)
        # @sin architecture_chat_NoRawMarkTypeDetector
        self.bus.run(ShowMark(1, MessageMarkType.THOUGHT, "summary", "key", "words"), event.actor)
        # @sin architecture_chat_NoRawMarkTypeDetector
        self.bus.run(AddDockItem(1, "plans.started", "plan", 1), event.actor)
        # @righteous architecture_chat_NoRawMarkTypeDetector
        self.bus.run(AddDockItem(1, MessageMarkType.THOUGHT.value, "plan", 1), event.actor)


def sample_declarations() -> None:
    # @sin architecture_chat_NoRawMarkTypeDetector
    MarkDeclaration("messages.thought", MessageMarkVariant, FAMILY, "Thoughts", "summary")
    # @sin architecture_chat_NoRawMarkTypeDetector
    DockDeclaration("plans.started", "plan", "Plan", "plan-dock.js")
    # @righteous architecture_chat_NoRawMarkTypeDetector
    MarkDeclaration(MessageMarkType.THOUGHT, MessageMarkVariant, FAMILY, "Thoughts", "summary")
