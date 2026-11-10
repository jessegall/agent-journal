from engine.actor.actor import Actor
from engine.change.change import Change
from engine.change.logged_event import LoggedEvent
from engine.command.bus import Bus
from engine.listener.commit_listener import CommitListener
from engine.listener.save_listener import SaveListener
from engine.model.model import Model
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.notes.models.enums.note_mark_type import NoteMarkType
from core.modules.notes.models.enums.note_mark_variant import NoteMarkVariant


# @righteous architecture_chat_viewer_work_inside_the_hook
# @sin naming_sentence_type_name
class NoteMarkAfterListener(CommitListener):
    """A sample that shows a note's mark after the commit, on the listener thread."""

    name = "notes.mark-after"
    # @sin architecture_listeners_listener_event_named_by_a_string
    event = "note.create"

    def __init__(self, bus: Bus) -> None:
        self.bus = bus

    def handle(self, event: LoggedEvent) -> None:
        self.bus.run(ShowMark(NoteMarkType.NOTE, NoteMarkVariant.MADE, "made:1", "Note made"), Actor.core(), environment_id=event.environment_id)
