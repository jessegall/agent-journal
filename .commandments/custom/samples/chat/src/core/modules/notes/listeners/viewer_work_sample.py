from engine.actor.actor import Actor
from engine.change.change import Change
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.notes.models.enums.note_mark_type import NoteMarkType
from core.modules.notes.models.enums.note_mark_variant import NoteMarkVariant


# @sin architecture_chat_viewer_work_inside_the_hook
class NoteMarkInsideListener(SaveListener):
    """A sample that shows a note's mark inside the writing transaction, holding the hook up."""

    name = "notes.mark-inside"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "note.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        self.bus.dispatch(ShowMark(NoteMarkType.NOTE, NoteMarkVariant.MADE, "made:1", "Note made"), change.context)

