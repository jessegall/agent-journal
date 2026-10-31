from core.base.actor import Actor
from core.base.change.change import Change
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.notes.models.enums.note_mark_type import NoteMarkType
from core.modules.notes.models.enums.note_mark_variant import NoteMarkVariant


# @sin architecture_chat_ViewerWorkAfterTheHookDetector
class NoteMarkInsideListener(SaveListener):
    """A sample that shows a note's mark inside the writing transaction, holding the hook up."""

    name = "notes.mark-inside"
    event = "note.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, change: Change[Model]) -> None:
        self.bus.dispatch(ShowMark(1, NoteMarkType.NOTE, NoteMarkVariant.MADE, "made:1", "Note made"), change.context)

