from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.docking.commands.add_dock_item.add_dock_item import AddDockItem
from core.modules.messages.models.enums.message_mark_type import MessageMarkType
from core.modules.messages.models.enums.message_mark_variant import MessageMarkVariant


class SampleHandler:
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, command, context):
        # @sin architecture_chat_mark_shown_outside_a_listener
        self.bus.run(ShowMark(MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "key", "words"), context.actor)


class SampleRoute:
    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def answer(self, window, argv, person):
        # @sin architecture_chat_mark_shown_outside_a_listener
        self.bus.run(ShowMark(MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "button", "words"), person)


class SampleListener(CommitListener):
    name = "samples.mark"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event):
        # @righteous architecture_chat_mark_shown_outside_a_listener
        self.bus.run(ShowMark(MessageMarkType.THOUGHT, MessageMarkVariant.SUMMARY, "key", "words"), event.actor)


class SampleRawListener(CommitListener):
    name = "samples.raw-mark"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "message.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event):
        # @sin architecture_chat_raw_mark_type
        self.bus.run(ShowMark("messages.thought", MessageMarkVariant.SUMMARY, "key", "words"), event.actor)
        # @sin architecture_chat_raw_mark_type
        self.bus.run(ShowMark(MessageMarkType.THOUGHT, "summary", "key", "words"), event.actor)
        # @sin architecture_chat_raw_mark_type
        self.bus.run(AddDockItem("plans.started", "plan", 1), event.actor)
        # @righteous architecture_chat_raw_mark_type
        self.bus.run(AddDockItem(MessageMarkType.THOUGHT.value, "plan", 1), event.actor)


def sample_declarations() -> None:
    # @sin architecture_chat_raw_mark_type
    MarkDeclaration("messages.thought", MessageMarkVariant, FAMILY, "Thoughts", "summary")
    # @sin architecture_chat_raw_mark_type
    DockDeclaration("plans.started", "plan", "Plan", "plan-dock.js")
    # @righteous architecture_chat_raw_mark_type
    MarkDeclaration(MessageMarkType.THOUGHT, MessageMarkVariant, FAMILY, "Thoughts", "summary")
